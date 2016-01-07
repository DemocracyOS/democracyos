import express from 'express'
import ReactEngine from 'lib/express-react-engine'
import home from './home/server'

const app = express()

app.engine('.js', ReactEngine({defaultLayout: 'layout/server'}))

app.set('view engine', '.js')
app.set('views', __dirname)

app.use('/', home)

export default app
