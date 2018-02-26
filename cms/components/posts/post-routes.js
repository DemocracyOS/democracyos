import React from 'react'
import { Route } from 'react-router-dom'
import { Delete } from 'admin-on-rest'
import { PostList } from './post-list'
import { PostShow } from './post-show'
import { PostCreate } from './post-create'
import { PostEdit } from './post-edit'

export default [
  <Route exact path='/admin/posts' render={(routeProps) => <PostList hasCreate={true} resource='posts' {...routeProps} />} />,
  <Route exact path='/admin/posts/create' render={(routeProps) => <PostCreate resource='posts' {...routeProps} />} />,
  <Route exact path='/admin/posts/:id/show' render={(routeProps) => <PostShow resource='posts' {...routeProps} />} />,
  <Route exact path='/admin/posts/:id/delete' render={(routeProps) => <Delete resource='posts' {...routeProps} />} />,
  <Route exact path='/admin/posts/:id' render={(routeProps) => <PostEdit resource='posts' {...routeProps} />} />
]