import eslint from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'

// TODO - ts and eslint in shared package
const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
  recommendedConfig: eslint.configs.recommended,
})

const eslintConfig = [
  ...compat.extends('next/typescript'),
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
    ],
  },
  ...compat.config({
    plugins: ['@typescript-eslint'],
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/eslint-recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:@next/next/recommended',
    ],
  }),
]

export default eslintConfig
