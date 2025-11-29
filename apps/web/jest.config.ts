/** @jest-config-loader esbuild-register */
import { nextJestConfig } from '@repo/jest-config/next'
import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createNextConfig = nextJest({ dir: './' })
const coverageCollect = nextJestConfig.collectCoverageFrom ?? []

const config: Config = {
  ...nextJestConfig,
  collectCoverageFrom: [
    '**/src/**/*.{ts,tsx}',
    '!**/*Interface.{ts,tsx}',
    '!**/background.ts',
    '!**/store.ts',
    '!**/theme.ts',
    '!**/useRedux.ts',
    ...coverageCollect,
  ],
  setupFilesAfterEnv: ['./test/config/setup.ts'],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 50,
      lines: 70,
      statements: 70,
    },
  },
}

export default createNextConfig(config)
