import type { Config } from 'jest'
import { jestConfig } from './base'

const coverageCollect = jestConfig?.collectCoverageFrom ?? []

export const nestJestConfig: Config = {
  ...jestConfig,
  transform: { '^.+\\.(t|j)s$': 'ts-jest' },
  testEnvironment: 'node',
  collectCoverageFrom: [
    ...coverageCollect,
    '!**/*index.ts',
    '!**/*.module.ts',
    '!**/dto/**',
    '!**/interface/**',
    '!**/test/utils/**',
  ],
  testPathIgnorePatterns: ['node_modules', '.turbo', 'dist', 'coverage'],
}
