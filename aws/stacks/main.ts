import * as sns from '@aws-cdk/aws-sns'
import * as s3 from '@aws-cdk/aws-s3'
import * as secretsmanager from '@aws-cdk/aws-secretsmanager'
import * as sqs from '@aws-cdk/aws-sqs'
import * as logs from '@aws-cdk/aws-logs'
import * as cw from '@aws-cdk/aws-cloudwatch'
import * as kms from '@aws-cdk/aws-kms'
import * as dynamodb from '@aws-cdk/aws-dynamodb'
import * as cdk from '@aws-cdk/core'

import { LambdaFunction } from '../constructs/function'
import { addKey, addQueue, addTopic, addSecret, addTable, addBucket, configureLogMetric, configureLogMetricAlarm } from '../blocks/resources'
import { addFunctionFile, addFunctionPublish, addFunctionDynamoDBStream, addFunctionRotate, addFunctionSubscribe, addFunctionAlarm } from '../blocks/functions'
import { configureRotation, configureSubscription, subscribeFunction, configureDynamoDBStream, configureS3Event, configureEventRule } from '../blocks/configuration'
import { grantKeyAliasDecryptToLambda, grandBucketReadWriteToLambda, grantTopicPublishToLambda, configureKeyAccessForFunctionPublish, configureKeyAccessForSNS, grantTableReadWriteToLambda, grantSecretReadToLambda } from '../blocks/access'
import { outputSQSQueue } from '../blocks/outputs'

export class MainStack extends cdk.Stack {
  key: kms.IKey
  keyAlias: kms.IAlias
  queue: sqs.IQueue
  topic: sns.ITopic
  functionPublish: LambdaFunction
  functionSubscribe: LambdaFunction
  functionAlarm: LambdaFunction
  functionRotate: LambdaFunction
  functionStream: LambdaFunction
  functionFile: LambdaFunction
  logFilter: logs.MetricFilter
  alarm: cw.Alarm
  secret: secretsmanager.ISecret
  table: dynamodb.ITable
  bucket: s3.Bucket

  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    addKey(this)
    addQueue(this)
    addTopic(this)
    addTable(this)
    addBucket(this)

    addFunctionPublish(this)
    addFunctionSubscribe(this)
    addFunctionRotate(this)
    addFunctionFile(this)
    addSecret(this)

    configureSubscription(this)
    grantTopicPublishToLambda(this)
    configureKeyAccessForSNS(this)
    configureKeyAccessForFunctionPublish(this)

    subscribeFunction(this)
    configureLogMetric(this)
    configureLogMetricAlarm(this)

    addFunctionAlarm(this)
    grantKeyAliasDecryptToLambda(this)

    configureEventRule(this)

    configureRotation(this)
    grantTableReadWriteToLambda(this)

    addFunctionDynamoDBStream(this)
    configureDynamoDBStream(this)
    grandBucketReadWriteToLambda(this)

    configureS3Event(this)
    grantSecretReadToLambda(this)

    outputSQSQueue(this)
  }
}
