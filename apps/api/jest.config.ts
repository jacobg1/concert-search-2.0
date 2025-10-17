/** @jest-config-loader esbuild-register */
import { nestJestConfig } from '@repo/jest-config/nest'
import type { Config } from 'jest'

const config: Config = {
  ...nestJestConfig,
  setupFiles: ['./test/mocks/archiveSearch.ts'],
}

export default config
