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

    /**
     * Use KMS to create a new key to encrypt data at rest
     */
    addKey(this)

    /**
     * Create SQS queue.
     */
    addQueue(this)

    /**
     * Create SNS topic and add SQS subscription
     */
    addTopic(this)
    configureSubscription(this)
    configureKeyAccessForSNS(this)

    /**
     * Create lambda function to publish message in topic
     */
    addFunctionPublish(this)
    grantTopicPublishToLambda(this)
    configureKeyAccessForFunctionPublish(this)

    /**
     * Create lambda function to subscribe for sqs message
     */
    addFunctionSubscribe(this)
    subscribeFunction(this)

    /**
     * Create LogGroup Filter for metric about messages per event
     */
    configureLogMetric(this)

    /**
     * Create CloudWatch Alarm for metric
     */
    configureLogMetricAlarm(this)

    /**
     * Create DynamoDB
     */
    addTable(this)

    /**
     * Create Secret
     */
    addSecret(this)
    addFunctionRotate(this)
    configureRotation(this)

    /**
     * Create lambda function for alarm
     */
    addFunctionAlarm(this)
    configureEventRule(this)

    grantKeyAliasDecryptToLambda(this)
    grantTableReadWriteToLambda(this)
    grantSecretReadToLambda(this)

    /**
     * Create S3 Bucket
     */
    addBucket(this)

    /**
     * Create lamdba function for DynamoDB stream
     */
    addFunctionDynamoDBStream(this)
    configureDynamoDBStream(this)

    grandBucketReadWriteToLambda(this)

    /**
     * Create lambda function for S3 event
     */
    addFunctionFile(this)
    configureS3Event(this)

    /**
     * Add CloudFormation Outputs
     */
    outputSQSQueue(this)
  }
}
