import React from 'react'
import {Route} from 'react-router'
import 'lib/boot/routes'
import router from 'lib/site/boot/router'
import SignupComplete from './component'

const root = router.props.children.props

root.childRoutes = root.childRoutes || []

root.childRoutes.push(
  {
    path: 'signup/complete',
    component: SignupComplete
  }
)
