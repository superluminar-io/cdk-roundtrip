# CDK Roundtrip

> Examples for serverless AWS architecture.

## Architecture

- KMS for encryption at rest
- SQS queue for message queueing
- SNS topic for message publishing
- Lambda function to publish message
- Lambda function to process message
- CloudWatch LogGroup Filter for metric aggregation
- CloudWatch Alarm for metric alarms
- Lambda function for alarm handling with EventBridge
- DynamoDB table for alarm logging
- DynamoDB stream for change tracking
- Lambda function for DynamoDB persistance in S3
- SecretsManager secret for salt persistance
- Lambda function for secret Rotation

![Architecture](/docs/designer.png)

## Deploy

```bash
$ > yarn cdk deploy

[…]

QueueURL = https://sqs.eu-central-1.amazonaws.com/123456789/roundtrip-MyQueue
```

## Usage

The CloudFormation stack `roundtrip` contains all resources.

### Helpers

A list of potentially useful commands.

#### Send a couple of messages to SQS

```bash
$ > ./scripts/send-batch-to-sqs.sh https://sqs.eu-central-1.amazonaws.com/123456789/roundtrip-MyQueue
```
