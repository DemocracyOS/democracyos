import { Router } from 'express'

const api = new Router()

api.get('/', (req, res) => res.send('GET /api'))

export default api
