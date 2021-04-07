import { Handler } from "aws-lambda"
import * as AWSXRay from 'aws-xray-sdk'
import * as AWSRaw from "aws-sdk"

let AWS

try {
  AWS = AWSXRay.captureAWS(AWSRaw)
} catch (e) {
  AWS = AWSRaw
}

const SM = new AWS.SecretsManager({ apiVersion: '2017-10-17' })

const cycle = {
  createSecret: (ClientRequestToken: any, SecretId: any) => {
    return SM.putSecretValue({
      ClientRequestToken,
      SecretId,
      SecretString: Math.random().toString(36).substring(7),
      VersionStages: ['AWSPENDING']
    }).promise()
  },

  finishSecret: async (MoveToVersionId: any, SecretId: any) => {
    const { VersionIdsToStages } = await SM.describeSecret({ SecretId }).promise()
    let RemoveFromVersionId = ''

    if (VersionIdsToStages) {
      Object.keys(VersionIdsToStages).forEach(
        version => {
          if (VersionIdsToStages[version].indexOf('AWSCURRENT') >= 0) {
            RemoveFromVersionId = version
          }
        }
      )
    }

    await SM.updateSecretVersionStage({
      SecretId,
      VersionStage: 'AWSCURRENT',
      RemoveFromVersionId,
      MoveToVersionId
    }).promise()
  }
}

export const handler: Handler<any, void> = async (event) => {
  console.log('rotate.ts', JSON.stringify(event))

  try {
    const step = event.Step as 'createSecret' | 'finishSecret'
    await cycle[step](event.ClientRequestToken, event.SecretId)
  } catch (e) {
    console.log(`Unable to handle step: ${event.Step}`)
    console.log(e)
  }
}
