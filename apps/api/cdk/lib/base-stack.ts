import { Fn, RemovalPolicy, Stack, type StackProps } from 'aws-cdk-lib'
import {
  BlockPublicAccess,
  Bucket,
  BucketEncryption,
} from 'aws-cdk-lib/aws-s3'
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment'
import { StringParameter } from 'aws-cdk-lib/aws-ssm'
import { Construct } from 'constructs'
import { createResourceNames } from './util'

interface MyStackProps {
  env: { stage: string }
}

const assetPath = 'dist'

export class BaseStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props)
    const myProps = props as MyStackProps
    const {
      env: { stage },
    } = myProps

    const { bucketName, deployBucketName, parameterName } =
      createResourceNames(stage)

    const destinationBucket = new Bucket(this, bucketName, {
      bucketName,
      publicReadAccess: false,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      versioned: true,
      enforceSSL: true,
      autoDeleteObjects: true,
      removalPolicy: RemovalPolicy.DESTROY,
      encryption: BucketEncryption.S3_MANAGED,
    })

    const deployBucket = new BucketDeployment(this, deployBucketName, {
      sources: [Source.asset(assetPath)],
      destinationBucket,
      extract: false,
    })

    new StringParameter(this, parameterName, {
      parameterName,
      stringValue: Fn.select(0, deployBucket.objectKeys),
    })
  }
}
