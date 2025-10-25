/** @jest-config-loader esbuild-register */
import { nestJestConfig } from '@repo/jest-config/nest'
import type { Config } from 'jest'

const coverageCollect = nestJestConfig.collectCoverageFrom ?? []

const config: Config = {
  ...nestJestConfig,
  collectCoverageFrom: ['**/src/**/*.{ts,tsx}', ...coverageCollect],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  setupFiles: ['dotenv/config'],
  setupFilesAfterEnv: ['./test/config/setup.ts'],
  globalTeardown: './test/config/teardown.ts',
  transformIgnorePatterns: ['node_modules/(?!until-async)'],
}

export default config
