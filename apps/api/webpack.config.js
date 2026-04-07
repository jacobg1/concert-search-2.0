const DotEnv = require('dotenv-webpack')
const TerserPlugin = require('terser-webpack-plugin')
const { IgnorePlugin } = require('webpack')
const CopyPlugin = require('copy-webpack-plugin')

function getEntryPoint(withMocks) {
  return withMocks ? './src/mocks/mockMain.ts' : './src/main.ts'
}

function getExternals(withMocks) {
  return withMocks ? ['_http_common'] : []
}

function addEnvVariables(withMocks) {
  if (!withMocks) return []
  return [new DotEnv()]
}

function copyPlugin(withMocks) {
  if (!withMocks) return []
  return [
    new CopyPlugin({
      patterns: [{ from: './src/mocks/sound', to: './sound' }],
    }),
  ]
}

module.exports = (options) => {
  const ignoreImports = [
    '@nestjs/microservices/microservices-module',
    '@nestjs/websockets/socket-module',
    '@nestjs/platform-express',
  ]

  return {
    ...options,
    entry: getEntryPoint(process.env.WITH_MOCKS),
    externals: getExternals(process.env.WITH_MOCKS),
    optimization: {
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            keep_classnames: true,
          },
        }),
      ],
    },
    output: {
      ...options.output,
      libraryTarget: 'commonjs2',
    },
    plugins: [
      ...options.plugins,
      ...addEnvVariables(process.env.WITH_MOCKS),
      ...copyPlugin(process.env.WITH_MOCKS),
      new IgnorePlugin({
        checkResource(resource) {
          if (ignoreImports.includes(resource)) {
            return true
          }
          return false
        },
      }),
    ],
  }
}
