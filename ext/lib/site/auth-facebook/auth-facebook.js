import 'lib/boot/routes'
import router from 'lib/site/boot/router'
import Confirm from './confirm/component'

router.childRoutes.unshift({
  path: '/auth/facebook/confirm/authorize',
  component: Confirm
})
