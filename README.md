# CDK Roudtrip

> Serverless AWS architecture.

## Deploy

```bash
$ > yarn cdk deploy

[…]

QueueURL = https://sqs.eu-central-1.amazonaws.com/123456789/roundtrip-MyQueue
```

## Usage

### Helpers

```bash
$ > ./scripts/send-batch-to-sqs.sh https://sqs.eu-central-1.amazonaws.com/123456789/roundtrip-MyQueue
```
