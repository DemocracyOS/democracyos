import React from 'react'
import ReactDOM from 'react-dom/server'
import path from 'path'

export default function engineFactory (engineOptions) {
  if (!engineOptions) engineOptions = {}
  if (!engineOptions.docType) engineOptions.docType = '<!DOCTYPE html>'
  if (!engineOptions.defaultLayout) engineOptions.defaultLayout = false

  return function renderComponent (filename, options, callback) {
    options = options || {}

    try {
      let markup = engineOptions.docType

      filename = require.resolve(filename)
      const View = require(filename).default
      const locals = options.locals || {}
      const view = ReactDOM.renderToString(<View {...locals} />)

      let layoutFilename = typeof options.layout === 'undefined' ? engineOptions.defaultLayout : options.layout

      if (layoutFilename) {
        layoutFilename = require.resolve(path.join(this.root, layoutFilename))
        const Layout = require(layoutFilename).default
        const layout = ReactDOM.renderToStaticMarkup(<Layout body={view} locals={locals} />)
        markup += layout
      } else {
        markup += view
      }

      if (options.settings.env === 'development') {
        ;[
          filename,
          layoutFilename
        ].forEach(function (file) {
          if (require.cache.hasOwnProperty(file)) delete require.cache[file]
        })
      }

      callback(null, markup)
    } catch (error) {
      callback(error)
    }
  }
}
