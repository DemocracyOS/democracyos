import React from 'react'
import {Route} from 'react-router'
import 'lib/boot/routes'
import router from 'lib/site/boot/router'
import SignupComplete from './component'

const site = router.find((route) => route.key === 'lib-site')

site.props.children.unshift(
  <Route
    key='ext-signup-complete'
    path='/signup/complete'
    component={SignupComplete} />
)
