const GlobalizePlugin = require('globalize-webpack-plugin')
const { DEFAULT_LANG } = require('./main/config')

module.exports = {
  webpack: (config) => {
    config.plugins.push(new GlobalizePlugin({
      production: false,
      developmentLocale: DEFAULT_LANG,
      supportedLocales: ['en', 'es'],
      messages: 'locales/[locale].json',
      output: 'globalize-compiled-data-[locale].[hash].js',
      tmpdirBase: '.'
    }))
    return config
  }
}
