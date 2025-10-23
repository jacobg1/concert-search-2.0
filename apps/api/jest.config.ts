/** @jest-config-loader esbuild-register */
import { nestJestConfig } from '@repo/jest-config/nest'
import type { Config } from 'jest'

const coverageCollect = nestJestConfig.collectCoverageFrom ?? []

const config: Config = {
  ...nestJestConfig,
  collectCoverageFrom: ['**/src/**/*.{ts,tsx}', ...coverageCollect],
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  setupFiles: ['dotenv/config'],
  setupFilesAfterEnv: ['./test/config/setup.ts'],
  globalTeardown: './test/config/teardown.ts',
}

export default config
