import type { Config } from 'jest'

export const jestConfig: Config = {
  clearMocks: true,
  displayName: { name: ':)', color: 'green' },
  collectCoverage: true,
  collectCoverageFrom: [
    '**/*.{ts,tsx}',
    '!**/node_modules/**',
    '!**/*.d.ts',
    '!**/jest*',
    '!**/.turbo/**',
    '!**/jest-config/**',
    '!**/coverage/**',
  ],
  coverageThreshold: {
    global: {
      branches: 10,
      functions: 3,
      lines: 30,
      statements: 30,
    },
  },
}
