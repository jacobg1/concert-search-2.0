import type { Config } from 'jest'
import { jestConfig } from './base'

const coverageCollect = jestConfig?.collectCoverageFrom ?? []

export const nextJestConfig: Config = {
  ...jestConfig,
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  collectCoverageFrom: [
    ...coverageCollect,
    '!**/*index.ts',
    '!**/*index.css',
    '!**/*.svg',
    '!**/interface.ts',
  ],
  testPathIgnorePatterns: [
    'node_modules',
    'build',
    '.turbo',
    '.next',
    'coverage',
  ],
}
