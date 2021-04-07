# CDK Roudtrip

> Serverless AWS architecture.

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
