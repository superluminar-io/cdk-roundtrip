import { Handler, S3Handler } from "aws-lambda"
import * as AWSXRay from 'aws-xray-sdk'
import * as AWSRaw from "aws-sdk"

let AWS

try {
  AWS = AWSXRay.captureAWS(AWSRaw)
} catch (e) {
  AWS = AWSRaw
}

export const handler: S3Handler = async (event) => {
  console.log('file.ts', JSON.stringify(event))
}
