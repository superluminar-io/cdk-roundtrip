import * as iam from '@aws-cdk/aws-iam'

import { MainStack } from '../stacks/main'

export function configureKeyAccessForFunctionPublish(stack: MainStack) {
  stack.keyAlias.addToResourcePolicy(new iam.PolicyStatement({
    sid: 'function-pubblish-allow',
    effect: iam.Effect.ALLOW,
    resources: ['*'],
    principals: [
      stack.functionPublish.lambda.role!
    ],
    actions: [
      'kms:Decrypt',
      'kms:GenerateDataKey'
    ]
  }))
}

export function configureKeyAccessForSNS(stack: MainStack) {
  stack.keyAlias.addToResourcePolicy(new iam.PolicyStatement({
    sid: 'sns-allow',
    effect: iam.Effect.ALLOW,
    resources: ['*'],
    principals: [
      new iam.ServicePrincipal('sns'),
    ],
    actions: [
      'kms:Decrypt',
      'kms:GenerateDataKey'
    ]
  }))
}

export function grandBucketReadWriteToLambda(stack: MainStack) {
  stack.bucket.grantReadWrite(stack.functionStream.lambda)
}

export function grantTopicPublishToLambda(stack: MainStack) {
  stack.topic.grantPublish(stack.functionPublish.lambda)
}

export function grantTableReadWriteToLambda(stack: MainStack) {
  stack.table.grantReadWriteData(stack.functionAlarm.lambda)
}

export function grantSecretReadToLambda(stack: MainStack) {
  stack.secret.grantRead(stack.functionAlarm.lambda)
}

export function grantKeyAliasDecryptToLambda(stack: MainStack) {
  stack.keyAlias.grantDecrypt(stack.functionAlarm.lambda)
}