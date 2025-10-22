import nock from 'nock'

export default function teardown() {
  nock.enableNetConnect()
}
