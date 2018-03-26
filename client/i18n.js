import Globalize from 'globalize'

export const setLocale = (locale) => Globalize.locale(locale)

export const t = (key) => Globalize.formatMessage(key)

export const formatter = (key) => Globalize.dateFormatter(key)
