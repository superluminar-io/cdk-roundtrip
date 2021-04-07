import { Handler } from "aws-lambda"
import * as AWSXRay from 'aws-xray-sdk'
import * as AWSRaw from "aws-sdk"

let AWS

try {
  AWS = AWSXRay.captureAWS(AWSRaw)
} catch (e) {
  AWS = AWSRaw
}

const DB = new AWS.DynamoDB()
const SM = new AWS.SecretsManager({ apiVersion: '2017-10-17' })

export const handler: Handler<any, void> = async (event) => {
  console.log('alarm.ts', JSON.stringify(event))

  const salt = await SM.getSecretValue({ SecretId: process.env.SECRET_ARN! }).promise()

  await DB.putItem({
    Item: {
      "id": {
        "S": new Date().toISOString()
      },
      "salt": {
        "S": salt.SecretString
      }
    },
    TableName: process.env.TABLE_NAME!
  }).promise()
}
