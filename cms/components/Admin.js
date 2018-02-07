import React from 'react'
import createHistory from 'history/createBrowserHistory'
const history = createHistory()
import { Admin, Resource, Delete } from 'admin-on-rest'
import RestClient from '../../client/RestClient'
import CustomRoutes from '../../client/CustomRoutes'
import Dashboard from './Dashboard'
import Navbar from './Navbar'
import { PostList, PostCreate, PostEdit } from './Posts'

export default () => (
  <Admin menu={Navbar} title='Democracy OS' restClient={RestClient} customRoutes={CustomRoutes} history={history} >
    <Resource name='posts' list={PostList} create={PostCreate} edit={PostEdit} remove={Delete} />
    <Resource name='settings' list={PostList} />
    <Resource name='reaction-rule' list={PostList} />
    <Resource name='users' list={PostList} />
  </Admin>
)
