import { Handler, SQSHandler } from "aws-lambda"
import * as AWSXRay from 'aws-xray-sdk'
import * as AWSRaw from "aws-sdk"

let AWS

try {
  AWS = AWSXRay.captureAWS(AWSRaw)
} catch (e) {
  AWS = AWSRaw
}

export const handler: SQSHandler = async (event) => {
  console.log('subscribe.ts', JSON.stringify(event))

  console.log(`received: ${event.Records.length}`)
}
