import { concertList, singleConcert } from '@repo/mock-data/pre-api'
import { HttpMethods } from 'msw'
import nock from 'nock'
import { jsonContent } from '../../src/mocks/config'
import { offline } from '../../src/mocks/offline'
import {
  getApiBaseUrl,
  getMockInput,
  testConcertList,
  testCorsHeaders,
  testSingleConcert
} from '../../test/utils'

const mockConcertId = '001'
const mockSearchTerm = 'offline test'
const offlinePort = 3007
const offlineUrl = `http://localhost:${offlinePort}`

describe('Offline Api Integration', () => {
  let api: ReturnType<typeof offline.listen>

  beforeAll((done) => {
    api = offline.listen(offlinePort, () => done())
  })

  afterAll((done) => {
    api.close(() => done())
  })

  afterEach(() => {
    nock.cleanAll()
  })

  it('Offline api returns the correct concert list', async () => {
    nock(getApiBaseUrl())
      .get('/advancedsearch.php')
      .query(({ q }) => !!q?.includes(mockSearchTerm))
      .reply(200, concertList)

    const response = await fetch(
      `${offlineUrl}/concerts`,
      {
        method: HttpMethods.POST,
        headers: jsonContent,
        body: JSON.stringify(getMockInput(mockSearchTerm)),
      }
    )

    expect(response.body).toBeDefined()
    expect(response.status).toBe(200)

    const respBody = await response.json()

    testConcertList(respBody)
    testCorsHeaders(response.headers)
  })

  it('Offline api returns the correct individual concert', async () => {
    nock(getApiBaseUrl())
      .get(`/metadata/${mockConcertId}`)
      .reply(200, singleConcert)

    const response = await fetch(
      `${offlineUrl}/concerts/${mockConcertId}`,
      {
        method: HttpMethods.GET,
      }
    )

    expect(response.body).toBeDefined()
    expect(response.status).toBe(200)

    const respBody = await response.json()

    testSingleConcert(respBody)
    testCorsHeaders(response.headers)
  })

  it("Offline api throws an error if route is not found", async () => {
    const response = await fetch(
      `${offlineUrl}/invalid/${mockConcertId}`,
      {
        method: HttpMethods.GET,
      }
    )

    expect(response.status).toBe(500)
    expect(response.statusText).toBe("Internal Server Error")
    expect(response.ok).toBe(false)
    testCorsHeaders(response.headers)
  })
})
