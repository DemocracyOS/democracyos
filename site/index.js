/**
 * Module Dependencies
 */

import express from 'express'
import models from 'lib/models'

const app = express()

// IE header
app.use((req, res, next) => {
  res.setHeader('X-UA-Compatible', 'IE=Edge,chrome=1')
  next()
})

app.get('/', (req, res) => {
  const HTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>DemocracyOS</title>
      </head>
      <body>
        <div id="react-view"></div>
        <script type="application/javascript" src="/bundle.js"></script>
      </body>
    </html>`
  
  res.end(HTML)
})

export default app
