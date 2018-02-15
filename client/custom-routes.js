import React from 'react'
import { Route } from 'react-router-dom'
import { Delete } from 'admin-on-rest'
import Dashboard from '../cms/components/dashboard'
import { PostList, PostCreate, PostEdit } from '../cms/components/posts'
import { UsersList } from '../cms/components/users'
import { SettingsEdit } from '../cms/components/settings'

export default [
  <Route exact path='/admin' component={Dashboard} />,
  <Route exact path='/admin/settings' component={SettingsEdit} />,
  <Route exact path='/admin/reactions' render={(routeProps) => <PostList hasCreate={true} resource='reaction-rule' {...routeProps} />} />,
  <Route exact path='/admin/users' render={(routeProps) => <UsersList hasCreate={false} resource='users' {...routeProps} />} />,
  <Route exact path='/admin/posts' render={(routeProps) => <PostList hasCreate={true} resource='posts' {...routeProps} />} />,
  <Route exact path='/admin/posts/create' render={(routeProps) => <PostCreate resource='posts' {...routeProps} />} />,
  <Route exact path='/admin/posts/:id' render={(routeProps) => <PostEdit resource='posts' {...routeProps} />} />,
  <Route exact path="/admin/posts/:id/delete" render={(routeProps) => <Delete resource='posts' {...routeProps} />} />
]
