import React from 'react'
import { Route } from 'react-router-dom'
import { Delete } from 'admin-on-rest'
import Dashboard from '../cms/components/dashboard'
import { PostList, PostCreate, PostEdit } from '../cms/components/posts'
import { ReactionRuleList, ReactionRuleCreate, ReactionRuleEdit } from '../reactions/components/reaction-rule'

export default [
  <Route exact path='/admin' component={Dashboard} />,
  <Route exact path='/admin/settings' render={(routeProps) => <PostList hasCreate={true} resource='settings' {...routeProps} />} />,
  <Route exact path='/admin/users' render={(routeProps) => <PostList hasCreate={true} resource='users' {...routeProps} />} />,
  <Route exact path='/admin/posts' render={(routeProps) => <PostList hasCreate={true} resource='posts' {...routeProps} />} />,
  <Route exact path='/admin/posts/create' render={(routeProps) => <PostCreate resource='posts' {...routeProps} />} />,
  <Route exact path='/admin/posts/:id' render={(routeProps) => <PostEdit resource='posts' {...routeProps} />} />,
  <Route exact path="/admin/posts/:id/delete" render={(routeProps) => <Delete resource='posts' {...routeProps} />} />,
  <Route exact path='/admin/reaction-rule' render={(routeProps) => <ReactionRuleList hasCreate={true} resource='reaction-rule' {...routeProps} />} />,
  <Route exact path='/admin/reaction-rule/create' render={(routeProps) => <ReactionRuleCreate resource='reaction-rule' {...routeProps} />} />,
  <Route exact path='/admin/reaction-rule/:id' render={(routeProps) => <ReactionRuleEdit resource='reaction-rule' {...routeProps} />} />,
  <Route exact path='/admin/reaction-rule/:id/delete' render={(routeProps) => <Delete resource='reaction-rule' {...routeProps} />} />
]
