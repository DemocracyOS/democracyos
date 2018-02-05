import React from 'react'
import createHistory from 'history/createBrowserHistory'
const history = createHistory()
import { Admin, Resource } from 'admin-on-rest'
import RestClient from '../../client/RestClient'
import CustomRoutes from '../../client/CustomRoutes'
import Dashboard from './Dashboard'
import List from './List'
import Navbar from './Navbar'

export default () => (
  <Admin menu={Navbar} title='Democracy OS' restClient={RestClient} customRoutes={CustomRoutes} history={history} />
)
