import { Router } from 'express'

const app = new Router()

app.get('/', function (req, res) {
  res.locals.title = 'Home'
  res.render('home', {locals: {name: 'Pirulo'}})
})

export default app
