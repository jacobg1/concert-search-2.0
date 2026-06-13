import { App } from 'aws-cdk-lib'
import { BaseStack } from '../lib/base-stack'
import { getNPMEvent } from '../lib/util'
import { ApiStack } from '../lib/api-stack'

const app = new App()
const stage = process.env.STAGE

if (!stage) {
  throw new Error('Missing stage env var')
}

const props = {
  env: {
    stage,
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
}

if (getNPMEvent() === 'base') {
  new BaseStack(app, `ConcertSearchBaseStack-${stage}`, props)
} else {
  new ApiStack(app, `ConcertSearchApiStack-${stage}`, props)
}
