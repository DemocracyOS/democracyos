import React from 'react'
import { Route } from 'react-router-dom'
import Dashboard from '../cms/components/Dashboard'

export default [
  <Route exact path="/admin" component={Dashboard} />,
  <Route exact path="/admin/posts" component={Dashboard} />,
  <Route exact path="/admin/settings" component={Dashboard} />,
  <Route exact path="/admin/reactions" component={Dashboard} />
]
