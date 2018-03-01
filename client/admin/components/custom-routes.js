import React from 'react'
import { Route } from 'react-router-dom'
import Dashboard from '../../../cms/components/dashboard'
import PostRoutes from '../../../cms/components/posts/post-routes'
import SettingsRoutes from '../../../cms/components/settings/settings-routes'
import ReactionRoutes from '../../../reactions/components/reactions-routes'
import UserRoutes from '../../../users/components/users-routes'

export default [
  <Route exact path='/admin' component={Dashboard} />
].concat(PostRoutes, SettingsRoutes, ReactionRoutes, UserRoutes)
