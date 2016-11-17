const fs = require('fs')
const path = require('path')
const config = require('lib/config')
const notifierTemplates = require('democracyos-notifier/lib/templates')
const notifierConfig = require('democracyos-notifier/lib/config')
const translations = require('democracyos-notifier/lib/translations')
const pug = require('democracyos-notifier/node_modules/pug')

require('./translations')

const t = translations.t

notifierConfig.set({
  availableLocales: ['es']
})

t.en = t.es

const templates = {}

;[
  'comment-reply',
  'reset-password',
  'topic-published',
  'welcome-email'
].forEach(function (name) {
  var filePath = path.join(__dirname, './templates/' + name + '.pug')

  fs.readFile(filePath, {encoding: 'utf-8'}, function (err, template) {
    if (err) throw err
    templates[name] = pug.compile(template)
  })
})

function _pug (opts, vars, callback) {
  if ('string' === typeof opts) return _pug({name: opts}, vars, callback)

  if (config.enforceLocale) opts.lang = config.locale

  if (!templates[opts.name]) return callback(new Error('Template file not found.'))

  const content = replaceVars(templates[opts.name]({t: t}), vars)

  callback(null, content)
}

function replaceVars (template, vars) {
  if (!vars) return template

  var res = template

  if (res) {
    vars.forEach(function (v) {
      res = res.replace(v.name, v.content)
    })
  }

  return res
}

notifierTemplates.pug = _pug
