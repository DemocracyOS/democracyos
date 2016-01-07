import React from 'react'
import ReactDOM from 'react-dom/server'
import path from 'path'
import merge from 'lodash.merge'

export default function engineFactory (engineSettings = {}) {
  const settings = merge({
    defaultLayout: false,
    layoutDocType: '<!DOCTYPE html>'
  }, engineSettings)

  return function renderComponent (filename, options = {}, cb) {
    const opts = merge({
      layout: settings.defaultLayout,
      locals: {},
      _locals: {}
    }, options)

    try {
      let markup

      const contentFile = require.resolve(filename)
      const layoutPath = path.join(this.root, opts.layout)
      const layoutFile = opts.layout ? require.resolve(layoutPath) : false

      const Content = require(contentFile).default

      if (layoutFile) {
        const Layout = require(layoutFile).default

        const layout = <Layout
          content={Content}
          contentProps={opts.locals}
          {...opts._locals}
        />

        markup = settings.layoutDocType + ReactDOM.renderToStaticMarkup(layout)
      } else {
        const locals = merge({}, opts._locals, opts.locals)
        const content = <Content {...locals} />

        markup = ReactDOM.renderToString(content)
      }

      if (opts.settings.env === 'development') {
        ;[contentFile, layoutFile].forEach(clearCache)
      }

      cb(null, markup)
    } catch (err) {
      cb(err)
    }
  }
}

function clearCache (file) {
  if (!file) return
  if (require.cache.hasOwnProperty(file)) {
    delete require.cache[file]
  }
}
