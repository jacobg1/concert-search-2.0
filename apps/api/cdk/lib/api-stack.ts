import { Duration, Stack, type StackProps } from 'aws-cdk-lib'
import { Bucket } from 'aws-cdk-lib/aws-s3'
import { Runtime, Function, S3CodeV2 } from 'aws-cdk-lib/aws-lambda'
import { Construct } from 'constructs'
import {
  createResourceNames,
  getAllowHeaders,
  getAllowMethods,
  getAllowOrigins,
  getLatestVersionId,
  getSSMParamValue,
} from './util'
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations'
import { HttpApi, HttpMethod } from 'aws-cdk-lib/aws-apigatewayv2'

interface MyStackProps {
  env: { stage: string; region?: string }
}

export class ApiStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props)
    ;(async () => {
      const myProps = props as MyStackProps
      const {
        env: { stage, region },
      } = myProps

      if (!region) {
        throw new Error('Missing region')
      }

      const websiteUrl = `/concert-search-${stage}/website-url`

      const {
        bucketName,
        functionName,
        apiName,
        integrationName,
        parameterName,
      } = createResourceNames(stage)

      const objectKey = await getSSMParamValue(parameterName, region)
      const versionId = await getLatestVersionId(
        bucketName,
        objectKey,
        region
      )
      const s3Bucket = Bucket.fromBucketName(this, bucketName, bucketName)

      console.log('Using object key and version id: ', {
        objectKey,
        versionId,
      })

      const lambda = new Function(this, functionName, {
        functionName,
        code: S3CodeV2.fromBucketV2(s3Bucket, objectKey, {
          objectVersion: versionId,
        }),
        handler: 'main.handler',
        runtime: Runtime.NODEJS_24_X,
        timeout: Duration.seconds(29),
        environment: {
          NODE_ENV: 'production',
        },
      })

      const lambdaIntegration = new HttpLambdaIntegration(
        integrationName,
        lambda
      )

      const api = new HttpApi(this, apiName, {
        corsPreflight: {
          allowMethods: getAllowMethods(),
          allowOrigins: await getAllowOrigins(websiteUrl, region),
          allowHeaders: getAllowHeaders(),
        },
      })

      api.addRoutes({
        path: '/concerts',
        methods: [HttpMethod.POST],
        integration: lambdaIntegration,
      })

      api.addRoutes({
        path: '/concerts/{id}',
        methods: [HttpMethod.GET],
        integration: lambdaIntegration,
      })
    })()
  }
}
