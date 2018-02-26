import React from 'react'
import { Route } from 'react-router-dom'
import { SettingsEdit } from './settings-edit'

export default [
  <Route exact path='/admin/settings' component={SettingsEdit} />
]
