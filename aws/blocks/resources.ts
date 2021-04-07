import * as kms from '@aws-cdk/aws-kms'
import * as sns from '@aws-cdk/aws-sns'
import * as sqs from '@aws-cdk/aws-sqs'
import * as s3 from '@aws-cdk/aws-s3'
import * as dynamodb from '@aws-cdk/aws-dynamodb'
import * as secretsmanager from '@aws-cdk/aws-secretsmanager'
import * as cdk from '@aws-cdk/core'
import * as logs from '@aws-cdk/aws-logs'
import * as cw from '@aws-cdk/aws-cloudwatch'

import { MainStack } from '../stacks/main'

export function addKey(stack: MainStack) {
  stack.key = new kms.Key(stack, 'Key')
  stack.keyAlias = stack.key.addAlias('roundtrip/alias')
}

export function addQueue(stack: MainStack) {
  stack.queue = new sqs.Queue(stack, 'MyQueue', {
    visibilityTimeout: cdk.Duration.seconds(300),
    encryption: sqs.QueueEncryption.KMS,
    dataKeyReuse: cdk.Duration.minutes(5),
    encryptionMasterKey: stack.keyAlias,
  })
}

export function addTopic(stack: MainStack) {
  stack.topic = new sns.Topic(stack, 'MyTopic', {
    masterKey: stack.keyAlias,
  })
}

export function addSecret(stack: MainStack) {
  stack.secret = new secretsmanager.Secret(stack, 'MySecret', {
    encryptionKey: stack.keyAlias
  })
}

export function addTable(stack: MainStack) {
  stack.table = new dynamodb.Table(stack, 'MyTable', {
    partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
    encryptionKey: stack.keyAlias,
    stream: dynamodb.StreamViewType.NEW_AND_OLD_IMAGES
  })
}

export function addBucket(stack: MainStack) {
  stack.bucket = new s3.Bucket(stack, 'MyBucket', {
    encryption: s3.BucketEncryption.KMS,
    encryptionKey: stack.keyAlias,
  })
}

export function configureLogMetric(stack: MainStack) {
  const logGroup = new logs.LogGroup(stack, 'MyLogGroup', {
    logGroupName: `/aws/lambda/${stack.functionSubscribe.lambda.functionName}`
  })

  stack.logFilter = new logs.MetricFilter(stack, 'MyMetricFilter', {
    logGroup: logGroup,
    metricNamespace: 'Custom',
    metricName: 'SubscribeReceivedEvents',
    filterPattern: logs.FilterPattern.literal('[time, id, received = "INFO", body = "received:", count]'),
    metricValue: '$count',
  })
}

export function configureLogMetricAlarm(stack: MainStack) {
  stack.alarm = new cw.Alarm(stack, 'MyAlarm', {
    metric: stack.logFilter.metric().with({
      period: cdk.Duration.minutes(1),
      statistic: 'Maximum'
    }),
    threshold: 2,
    evaluationPeriods: 1,
    treatMissingData: cw.TreatMissingData.NOT_BREACHING
  })
}