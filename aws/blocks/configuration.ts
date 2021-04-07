import * as iam from '@aws-cdk/aws-iam'
import * as cdk from '@aws-cdk/core'
import * as subs from '@aws-cdk/aws-sns-subscriptions'
import * as lambdaEvent from '@aws-cdk/aws-lambda-event-sources'
import * as s3 from '@aws-cdk/aws-s3'
import * as events from '@aws-cdk/aws-events'
import * as eventsTarget from '@aws-cdk/aws-events-targets'
import * as lambda from '@aws-cdk/aws-lambda'

import { MainStack } from '../stacks/main'

export function configureRotation(stack: MainStack) {
  stack.functionRotate.lambda.addPermission('MyPermission', {
    action: 'lambda:InvokeFunction',
    principal: new iam.ServicePrincipal('secretsmanager.amazonaws.com'),
  })

  stack.secret.addRotationSchedule('MyRotation', {
    rotationLambda: stack.functionRotate.lambda,
    automaticallyAfter: cdk.Duration.days(1)
  })

  stack.keyAlias.grantEncryptDecrypt(stack.functionRotate.lambda)

  stack.functionRotate.lambda.addToRolePolicy(new iam.PolicyStatement({
    effect: iam.Effect.ALLOW,
    actions: [
      'secretsmanager:DescribeSecret',
      'secretsmanager:PutSecretValue',
      'secretsmanager:UpdateSecretVersionStage'
    ],
    resources: [
      stack.secret.secretArn
    ]
  }))
}

export function configureSubscription(stack: MainStack) {
  stack.topic.addSubscription(
    new subs.SqsSubscription(stack.queue, {
      rawMessageDelivery: true,
    })
  )
}

export function subscribeFunction(stack: MainStack) {
  stack.functionSubscribe.lambda.addEventSource(
    new lambdaEvent.SqsEventSource(stack.queue,
      {
        batchSize: 5,
      }
    )
  )
}

export function configureDynamoDBStream(stack: MainStack) {
  stack.functionStream.lambda.addEventSource(new lambdaEvent.DynamoEventSource(stack.table, {
    startingPosition: lambda.StartingPosition.TRIM_HORIZON,
    batchSize: 1,
  }))
}

export function configureS3Event(stack: MainStack) {
  stack.functionFile.lambda.addEventSource(new lambdaEvent.S3EventSource(stack.bucket, {
    events: [s3.EventType.OBJECT_CREATED],
  }))
}

export function configureEventRule(stack: MainStack) {
  const rule = new events.Rule(stack, 'MyRule', {
    eventPattern: {
      detailType: ['CloudWatch Alarm State Change'],
      source: ['aws.cloudwatch'],
      detail: {
        'alarmName': [stack.alarm.alarmName]
      }
    }
  })

  rule.addTarget(
    new eventsTarget.LambdaFunction(stack.functionAlarm.lambda)
  )
}