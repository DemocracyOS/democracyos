import express from 'express'

const app = express()

app.get('/', (req, res) => res.send('GET /api'))

export default app
