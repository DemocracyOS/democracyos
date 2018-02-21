import React from 'react'
import { Route } from 'react-router-dom'
import { Delete } from 'admin-on-rest'
import Dashboard from '../cms/components/dashboard'
import { PostList } from '../cms/components/posts/post-list'
import { PostShow } from '../cms/components/posts/post-show'
import { PostCreate } from '../cms/components/posts/post-create'
import { PostEdit } from '../cms/components/posts/post-edit'
import { ReactionRuleList, ReactionRuleCreate, ReactionRuleEdit } from '../reactions/components/reaction-rule'
import { UserList, UserShow } from '../users/components/users'
import { SettingsEdit } from '../cms/components/settings'

export default [
  <Route exact path='/admin' component={Dashboard} />,
  <Route exact path='/admin/settings' component={SettingsEdit} />,
  <Route exact path='/admin/users' render={(routeProps) => <UserList hasCreate={false} resource='users' {...routeProps} />} />,
  <Route exact path='/admin/users/:id/show' render={(routeProps) => <UserShow resource='users' {...routeProps} />} />,
  <Route exact path='/admin/posts' render={(routeProps) => <PostList hasCreate={true} resource='posts' {...routeProps} />} />,
  <Route exact path='/admin/posts/create' render={(routeProps) => <PostCreate resource='posts' {...routeProps} />} />,
  <Route exact path='/admin/posts/:id/show' render={(routeProps) => <PostShow resource='posts' {...routeProps} />} />,
  <Route exact path='/admin/posts/:id/delete' render={(routeProps) => <Delete resource='posts' {...routeProps} />} />,
  <Route exact path='/admin/posts/:id' render={(routeProps) => <PostEdit resource='posts' {...routeProps} />} />,
  <Route exact path='/admin/reaction-rule' render={(routeProps) => <ReactionRuleList hasCreate={true} resource='reaction-rule' {...routeProps} />} />,
  <Route exact path='/admin/reaction-rule/create' render={(routeProps) => <ReactionRuleCreate resource='reaction-rule' {...routeProps} />} />,
  <Route exact path='/admin/reaction-rule/:id' render={(routeProps) => <ReactionRuleEdit resource='reaction-rule' {...routeProps} />} />,
  <Route exact path='/admin/reaction-rule/:id/delete' render={(routeProps) => <Delete resource='reaction-rule' {...routeProps} />} />
]
