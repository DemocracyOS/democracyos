import React from 'react'
import { Admin } from 'admin-on-rest'
import Dashboard from './Dashboard'
import Navbar from './Navbar'

export default () => (
  <Admin dashboard={Dashboard} menu={Navbar} />
)
