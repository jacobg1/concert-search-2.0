/** @jest-config-loader esbuild-register */
import { nestJestConfig } from '@repo/jest-config/nest'
import type { Config } from 'jest'

const coverageCollect = nestJestConfig.collectCoverageFrom ?? []

const config: Config = {
  ...nestJestConfig,
  collectCoverageFrom: ['**/src/**/*.{ts,tsx}', ...coverageCollect],
  coverageThreshold: {
    global: {
      branches: 40,
      functions: 55,
      lines: 60,
      statements: 60,
    },
  },
  setupFiles: ['dotenv/config'],
  setupFilesAfterEnv: ['./test/config/setup.ts'],
  globalTeardown: './test/config/teardown.ts',
}

export default config
