import 'lib/boot/routes'
import router from 'lib/site/boot/router'
import TerminosYCondiciones from './pages/terminos-y-condiciones'

router.childRoutes.unshift({
  path: 's/terminos-y-condiciones',
  component: TerminosYCondiciones
})
