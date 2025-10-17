import type { Config } from 'jest'
import { jestConfig } from './base'

export const nestJestConfig: Config = {
  ...jestConfig,
  transform: { '^.+\\.(t|j)s$': 'ts-jest' },
  testEnvironment: 'node',
  collectCoverageFrom: [
    ...(jestConfig?.collectCoverageFrom ?? []),
    '!**/*index.ts',
    '!**/interface/**',
    '!**/mocks/data/**',
    '!**/test/mocks/**',
  ],
  testPathIgnorePatterns: ['node_modules', '.turbo', 'dist', 'coverage'],
}
