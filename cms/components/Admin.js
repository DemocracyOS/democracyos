import React from 'react'
import { Admin } from 'admin-on-rest'
import Dashboard from './Dashboard'

export default () => (
  <Admin dashboard={Dashboard}>
    <p>Hola soy una admin</p>
  </Admin>
)
