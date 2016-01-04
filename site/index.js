/**
 * Module Dependencies
 */

import express from 'express'

const app = express()

// IE header
app.use((req, res, next) => {
  res.setHeader('X-UA-Compatible', 'IE=Edge,chrome=1')
  next()
})

app.get('/', (req, res) => res.send('GET /'))

export default app
