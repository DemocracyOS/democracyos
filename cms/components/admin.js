import React from 'react'
import createHistory from 'history/createBrowserHistory'
import { Admin, Resource, Delete } from 'admin-on-rest'
import RestClient from '../../client/admin/components/rest-client'
import CustomRoutes from '../../client/admin/components/custom-routes'
import { ReactionRuleList, ReactionRuleCreate, ReactionRuleEdit } from '../../reactions/components/reaction-rule'
import { ReactionInstanceList, ReactionInstanceCreate, ReactionInstanceEdit, ReactionInstanceShow } from '../../reactions/components/reaction-instance'
import { UserList, UserView } from '../../users/components/users'
import { PostList } from './posts/post-list'
import { PostShow } from './posts/post-show'
import { PostCreate } from './posts/post-create'
import { PostEdit } from './posts/post-edit'
import Dashboard from './dashboard'
import Navbar from './navbar'

const history = createHistory({ basename: '/admin' })

export default (props) => (
  <Admin title='Democracy OS' restClient={RestClient} customRoutes={CustomRoutes} history={history} dashboard={Dashboard} menu={Navbar} >
    <Resource name='posts' list={PostList} show={PostShow} create={PostCreate} edit={PostEdit} remove={Delete} />
    <Resource name='reaction-rule' options={{ label: 'Reaction Rules' }} list={ReactionRuleList} create={ReactionRuleCreate} edit={ReactionRuleEdit} />
    <Resource name='reaction-instance' options={{ label: 'Reaction Instances' }} show={ReactionInstanceShow} list={ReactionInstanceList} create={ReactionInstanceCreate} edit={ReactionInstanceEdit} />
    <Resource name='users' list={UserList} edit={UserView} />
  </Admin>
)
