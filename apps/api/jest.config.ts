/** @jest-config-loader esbuild-register */
import { nestJestConfig } from '@repo/jest-config/nest'
import type { Config } from 'jest'

const coverage = nestJestConfig.coverageThreshold?.global ?? {}

const config: Config = {
  ...nestJestConfig,
  setupFiles: ['<rootDir>/test/mocks/archiveSearch.ts'],
  coverageThreshold: {
    global: {
      ...coverage,
      functions: 0,
      branches: 10,
      lines: 29,
    },
  },
}

export default config
