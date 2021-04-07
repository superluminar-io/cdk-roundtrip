import { Handler } from "aws-lambda"
import * as AWSXRay from 'aws-xray-sdk'
import * as AWSRaw from "aws-sdk"

let AWS

try {
  AWS = AWSXRay.captureAWS(AWSRaw)
} catch (e) {
  AWS = AWSRaw
}

const SNS = new AWS.SNS({ apiVersion: "2010-03-31" })

export interface HandlerEvent {
  fails: boolean
}

export const handler: Handler<HandlerEvent, boolean> = async (event) => {
  console.log('publish.ts', JSON.stringify(event))

  if (event.fails) {
    throw new Error('Failed on purpose')
  }

  await SNS.publish({
    TopicArn: process.env.TOPIC_ARN,
    Message: JSON.stringify(event),
  }).promise()

  return true
}
