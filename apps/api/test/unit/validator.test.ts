import { getMockInput } from '../utils'
import { ConcertValidator } from '../../src/helpers'
import { BadGatewayException, Logger } from '@nestjs/common'

const mockSearchTerm = 'testing'
const mediaFormatOutput = ['VBR MP3', 'Ogg Vorbis']

const formattedOutput = {
  mediaFormat: mediaFormatOutput,
  searchTerm: mockSearchTerm,
  max: 50,
  filterDuplicates: false,
  sortBy: { downloads: 'desc' },
}

const errorLogMock = jest.spyOn(Logger, 'error')

describe('Validator Tests', () => {
  let validator: ConcertValidator

  afterAll(() => {
    jest.restoreAllMocks()
  })

  beforeEach(() => {
    validator = new ConcertValidator()
  })

  it('formatValue works properly', () => {
    const input = ['ogg', 'mp3']

    validator.formatValue(input).forEach((val) => {
      expect(mediaFormatOutput).toContain(val)
    })
  })

  it('transform works properly', async () => {
    const payload = await validator.transform(getMockInput(mockSearchTerm))
    expect(payload).toEqual(formattedOutput)
  })

  it('transform throws validation error for invalid input', async () => {
    const expectedError = new BadGatewayException(
      'searchTerm must be a string.'
    )

    errorLogMock.mockReturnThis()

    const invalidInput = undefined as unknown as string

    await expect(
      validator.transform(getMockInput(invalidInput))
    ).rejects.toEqual(expectedError)

    expect(errorLogMock).toHaveBeenCalledTimes(1)
  })
})
