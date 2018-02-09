import Globalize from 'globalize'

export const setLocale = (locale) => Globalize.locale(locale)

export const t = (key) => Globalize.formatMessage(key)
