import React from 'react'
import { Route } from 'react-router-dom'
import { UserList, UserView } from './users'

export default [
  <Route exact path='/admin/users' render={(routeProps) => <UserList hasCreate={false} resource='users' {...routeProps} />} />,
  <Route exact path='/admin/users/:id' render={(routeProps) => <UserView resource='users' {...routeProps} />} />
]
