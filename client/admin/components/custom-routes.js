import React from 'react'
import { Route } from 'react-router-dom'
import Dashboard from '../../../cms/components/dashboard'
import SettingsRoutes from '../../../cms/components/settings/settings-routes'

export default [
  <Route exact path='/' component={Dashboard} />
].concat(SettingsRoutes)
