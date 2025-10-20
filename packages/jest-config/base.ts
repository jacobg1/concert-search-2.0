import type { Config } from 'jest'

export const jestConfig: Config = {
  clearMocks: true,
  displayName: { name: ':)', color: 'green' },
  collectCoverage: true,
  collectCoverageFrom: [
    '!**/node_modules/**',
    '!**/*.d.ts',
    '!**/jest*',
    '!**/.turbo/**',
    '!**/jest-config/**',
    '!**/coverage/**',
  ],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
}
