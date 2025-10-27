import { getMockPath, getFromEnv, getJsonResponse } from '../utils'
import { handlers } from '../../src/mocks/handlers'

const mockRequestId = '12345'
const mockConcertId = '001'
const mockConcertUrl = `${getFromEnv('API_BASE_URL')}/metadata/${mockConcertId}`
const mockConcertListUrl = getFromEnv('ADVANCED_SEARCH_URL')

describe('Mock Handlers Tests', () => {
  const prevEnv = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...prevEnv }
  })

  afterEach(() => {
    process.env = prevEnv
  })

  it('mock single concert handler works properly', async () => {
    const [concert] = handlers

    const concertResult = await concert.run({
      request: new Request(mockConcertUrl),
      requestId: mockRequestId,
    })

    const jsonResponse = await getJsonResponse<
      Record<string, string | unknown[]>
    >(concertResult?.response)

    expect(jsonResponse.files).toBeDefined()
    expect(jsonResponse.files.length).toBeGreaterThan(1)
    expect(concert.info.header).toBe(getMockPath('METADATA_URL'))
  })

  it('mock concert list handler works properly', async () => {
    const [, list] = handlers

    const listResult = await list.run({
      request: new Request(mockConcertListUrl),
      requestId: mockRequestId,
    })

    const jsonResponse = await getJsonResponse<
      Record<string, Record<string, unknown[]>>
    >(listResult?.response)

    expect(jsonResponse.response.docs).toBeDefined()
    expect(jsonResponse.response.docs.length).toBeGreaterThan(1)
    expect(list.info.header).toBe(getMockPath('ADVANCED_SEARCH_URL'))
  })

  it("handlers throw an error if required env vars aren't found", async () => {
    process.env.METADATA_URL = ''

    let testError: unknown

    try {
      await import('../../src/mocks/handlers')
    } catch (err: unknown) {
      testError = err
    }

    expect(testError).toBeDefined()
    expect((testError as Error).message).toBe('missing mock url')
  })
})
