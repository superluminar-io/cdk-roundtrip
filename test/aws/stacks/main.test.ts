import '@aws-cdk/assert/jest'
import * as cdk from '@aws-cdk/core'

import { MainStack } from '../../../aws/stacks/main'

describe('Stack', () => {
  let app: cdk.App
  let stack: MainStack

  beforeAll(() => {
    app = new cdk.App()
    stack = new MainStack(app, 'MyTestStack')
  })

  describe('SQS Queue', () => {
    it('is created', () => {
      expect(stack).toHaveResource("AWS::SQS::Queue", {
        VisibilityTimeout: 300
      })
    })
  })

  describe('SNS Topic', () => {
    it('is created', () => {
      expect(stack).toHaveResource("AWS::SNS::Topic")
    })
  })

  describe('Lambda Function', () => {
    it('is created', () => {
      expect(stack).toHaveResource("AWS::Lambda::Function")
    })
  })
})
