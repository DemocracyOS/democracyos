import React from 'react'
import {Route} from 'react-router'
import 'lib/boot/routes'
import router from 'lib/site/boot/router'

const site = router.find((route) => route.key === 'lib-site')

site.props.children.unshift(
  <Route
    key='participatory-budget-vote'
    path='/ext/api/participatory-budget/vote'
    component={reload} />
)

function reload () {
  window.location.reload(false)
  return null
}
