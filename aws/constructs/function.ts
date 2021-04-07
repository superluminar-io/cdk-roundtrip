import * as cdk from '@aws-cdk/core'
import * as lambda from '@aws-cdk/aws-lambda'
import * as lambdaNode from '@aws-cdk/aws-lambda-nodejs'
import * as iam from '@aws-cdk/aws-iam'

export interface LambdaFunctionProps {
  file: string
  environment?: { [key: string]: string }
}

export class LambdaFunction extends cdk.Construct {
  lambda: lambda.IFunction

  constructor(scope: cdk.Construct, id: string, props: LambdaFunctionProps | string) {
    super(scope, id)

    this.lambda = new lambdaNode.NodejsFunction(this, 'Function', {
      tracing: lambda.Tracing.ACTIVE,
      runtime: lambda.Runtime.NODEJS_14_X,
      layers: [
        this.getOrCreateLambdaInsightsLayer()
      ],
      entry: typeof props === 'string' ? props : props.file,
      environment: typeof props === 'string' ? undefined : props.environment
    })

    this.lambda.role?.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName('CloudWatchLambdaInsightsExecutionRolePolicy'),
    )
  }

  public getOrCreateLambdaInsightsLayer() {
    const uniqueid = 'LambdaInsightsLayer'
    const stack = cdk.Stack.of(this)
    const layer = stack.node.tryFindChild(uniqueid) as lambda.ILayerVersion

    return layer || lambda.LayerVersion.fromLayerVersionArn(
      stack,
      uniqueid,
      `arn:aws:lambda:${cdk.Stack.of(this).region}:580247275435:layer:LambdaInsightsExtension:14`,
    )
  }
}