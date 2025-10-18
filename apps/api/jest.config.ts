/** @jest-config-loader esbuild-register */
import { nestJestConfig } from '@repo/jest-config/nest'
import type { Config } from 'jest'

const coverageCollect = nestJestConfig.collectCoverageFrom ?? []

const config: Config = {
  ...nestJestConfig,
  collectCoverageFrom: ['**/src/**/*.{ts,tsx}', ...coverageCollect],
  coverageThreshold: {
    global: {
      branches: 20,
      functions: 33,
      lines: 40,
      statements: 40,
    },
  },
}

export default config
