import { DynamoDBStreamHandler } from "aws-lambda"
import * as AWSXRay from 'aws-xray-sdk'
import * as AWSRaw from "aws-sdk"

let AWS

try {
  AWS = AWSXRay.captureAWS(AWSRaw)
} catch (e) {
  AWS = AWSRaw
}

const S3 = new AWS.S3()

function addZero(i: number) {
  return (i < 10) ? `0${i}` : i.toString()
}

export const handler: DynamoDBStreamHandler = async (event) => {
  console.log('stream.ts', JSON.stringify(event))

  const record = event.Records[0]
  const object = `${addZero(new Date().getUTCHours())}/${record.eventID!}.json`

  await S3.putObject({
    Body: JSON.stringify(record),
    Bucket: process.env.BUCKET_NAME!,
    Key: object,
  }).promise()
}
