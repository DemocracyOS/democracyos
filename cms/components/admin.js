import React from 'react'
import createHistory from 'history/createBrowserHistory'
const history = createHistory()
import { Admin, Resource, Delete } from 'admin-on-rest'
import RestClient from '../../client/rest-client'
import CustomRoutes from '../../client/custom-routes'
import Dashboard from './dashboard'
import Navbar from './navbar'
import { ReactionRuleList, ReactionRuleCreate, ReactionRuleEdit } from '../../reactions/components/reaction-rule'
import { PostList, PostShow, PostCreate, PostEdit } from './posts'
import { UsersList } from './users'

export default (props) => (
  <Admin menu={Navbar} title='Democracy OS' restClient={RestClient} customRoutes={CustomRoutes} history={history} >
    <Resource name='posts' list={PostList} show={PostShow} create={PostCreate} edit={PostEdit} remove={Delete} />
    <Resource name='reaction-rule' options={{ label: 'Reaction Rules' }} list={ReactionRuleList} create={ReactionRuleCreate} edit={ReactionRuleEdit} />
    <Resource name='users' list={UsersList} />
  </Admin>
)
