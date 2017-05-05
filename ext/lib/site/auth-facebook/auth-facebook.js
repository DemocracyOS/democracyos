import 'lib/boot/routes'
import router from 'lib/site/boot/router'
import BtnFacebook from 'lib/site/sign-in/btn-facebook'
import Confirm from './confirm/component'

BtnFacebook.defaultProps.action = '/auth/facebook/confirm'

router.childRoutes.unshift({
  path: '/auth/facebook/confirm/authorize',
  component: Confirm
})
