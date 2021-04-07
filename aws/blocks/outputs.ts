import * as cdk from '@aws-cdk/core'

import { MainStack } from '../stacks/main'

export function outputSQSQueue(stack: MainStack) {
  new cdk.CfnOutput(stack, 'QueueURL', { value: stack.queue.queueUrl })
}