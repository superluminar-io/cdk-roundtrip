import { LambdaFunction } from '../constructs/function'
import { MainStack } from '../stacks/main'

export function addFunctionFile(stack: MainStack) {
  stack.functionFile = new LambdaFunction(stack, "MyFunctionFile", "src/file.ts")
}

export function addFunctionSubscribe(stack: MainStack) {
  stack.funtionSubscribe = new LambdaFunction(stack, "MyFunctionSubscribe", "src/subscribe.ts")
}

export function addFunctionRotate(stack: MainStack) {
  stack.functionRotate = new LambdaFunction(stack, "MyFunctionRotate", "src/rotate.ts")
}

export function addFunctionPublish(stack: MainStack) {
  stack.funtionPublish = new LambdaFunction(stack, "MyFunctionPublish", {
    file: "src/publish.ts",
    environment: {
      TOPIC_ARN: stack.topic.topicArn,
    },
  })
}

export function addFunctionDynamoDBStream(stack: MainStack) {
  stack.functionStream = new LambdaFunction(stack, "MyFunctionStream", {
    file: "src/stream.ts",
    environment: {
      'BUCKET_NAME': stack.bucket.bucketName
    }
  })
}

export function addFunctioAlarm(stack: MainStack) {
  stack.functionAlarm = new LambdaFunction(stack, "MyFunctionAlarm", {
    file: "src/alarm.ts",
    environment: {
      'TABLE_NAME': stack.table.tableName,
      'SECRET_ARN': stack.secret.secretArn
    },
  })
}