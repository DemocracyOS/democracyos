import 'lib/boot/routes'
import router from 'lib/site/boot/router'
import SignupComplete from './component'

router.childRoutes.unshift({
  path: 'signup/complete',
  component: SignupComplete
})
