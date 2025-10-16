import globals from 'globals'
import { config as baseConfig } from './base.js'
import eslintNestJs from '@darraghor/eslint-plugin-nestjs-typed'
import tseslint from 'typescript-eslint'

/**
 * @type {import("eslint").Linter.Config[]}
 * */
export const nestJsConfig = [
  ...baseConfig,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    rules: {
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-extraneous-class': 'off',
    },
  },
  ...eslintNestJs.configs.flatRecommended,
  {
    ignores: ['**/eslint.config.mjs', '**/webpack.config.js', '**/dist'],
  },
]
