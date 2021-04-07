#!/bin/bash

aws sqs send-message-batch --queue-url $1 --entries file://fixtures/batch.sqs.json --no-cli-pager