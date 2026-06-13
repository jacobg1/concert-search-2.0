import { S3Client, ListObjectVersionsCommand } from '@aws-sdk/client-s3'
import { SSMClient, GetParameterCommand } from '@aws-sdk/client-ssm'
import { CorsHttpMethod } from 'aws-cdk-lib/aws-apigatewayv2'

interface ResourceNames {
  bucketName: string
  deployBucketName: string
  parameterName: string
  functionName: string
  apiName: string
  integrationName: string
}

function namePrefix(stage: string): string {
  return `concert-search-${stage}`
}

export function createResourceNames(stage: string): ResourceNames {
  const prefix = namePrefix(stage)
  const bucketName = `${prefix}-bucket`

  return {
    bucketName,
    deployBucketName: `${bucketName}-deploy`,
    functionName: `${prefix}-function`,
    apiName: `${prefix}-api`,
    parameterName: `/${prefix}/obj-key`,
    integrationName: `${prefix}-integration`,
  }
}

export async function getSSMParamValue(
  paramName: string,
  region: string
): Promise<string> {
  try {
    const client = new SSMClient({ region })

    const command = new GetParameterCommand({
      Name: paramName,
    })

    const res = await client.send(command)

    if (!res?.Parameter?.Value) return ''

    const {
      Parameter: { Value },
    } = res

    return Value
  } catch {
    return ''
  }
}

export async function getLatestVersionId(
  bucketName: string,
  objectKey: string,
  region: string
): Promise<string> {
  try {
    const client = new S3Client({ region })
    const command = new ListObjectVersionsCommand({
      Bucket: bucketName,
      Prefix: objectKey,
    })

    const { Versions } = await client.send(command)
    const result = Versions?.find(({ IsLatest }) => IsLatest)

    return result?.VersionId || ''
  } catch {
    return ''
  }
}

export function getNPMEvent() {
  const event = process.env.npm_lifecycle_event

  if (!event) {
    throw new Error('Missing npm event')
  }

  const splitEvent = event?.split(':')
  return splitEvent[splitEvent.length - 1]
}

export function getAllowHeaders(): string[] {
  return [
    'Content-Type',
    'Accept',
    'Vary',
    'Origin',
    'Access-Control-Allow-Origin',
    'Access-Control-Request-Headers',
  ]
}

export function getAllowMethods(): CorsHttpMethod[] {
  return [CorsHttpMethod.GET, CorsHttpMethod.POST]
}

export async function getAllowOrigins(
  paramName: string,
  region: string
): Promise<string[]> {
  return [await getSSMParamValue(paramName, region)]
}
