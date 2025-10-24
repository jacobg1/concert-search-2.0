import { logMockRequest } from '../../src/helpers'

const mockConsoleLog = jest.spyOn(console, 'log')

describe('Mock Utils Tests', () => {
  afterAll(() => {
    jest.restoreAllMocks()
  })

  it('logMockRequest works properly', () => {
    const input = {
      request: {
        method: 'GET',
        url: 'test',
      } as Request,
    }

    logMockRequest(input)

    expect(mockConsoleLog).toHaveBeenCalledWith(
      'MSW intercepted:',
      input.request.method,
      input.request.url
    )
  })
})
