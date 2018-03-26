import Globalize from 'globalize'

// Sets the current locale with the given string.
export const setLocale = (locale) => Globalize.locale(locale)

// Message formatter. Receives a string to translate.
export const t = (key) => Globalize.formatMessage(key)

// Date formatter. Receives an object with the formatting options and the key with the value to format.
export const date = (options, key) => Globalize.dateFormatter(options)(new Date(key))
