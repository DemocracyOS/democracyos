import { Router } from 'express'

const app = new Router()

app.get('/', function (req, res) {
  res.render('home', {locals: {title: 'Home'}})
})

export default app
