import React from 'react'
import { Link } from 'react-router'

export default () => (
  <footer className='container-fluid ext-footer'>
    <div className='disclaimer'>
      <p>
        Desarrollado con software libre por la Municipalidad de Rosario y <a href='http://democraciaenred.org' rel='noopener noreferrer' target='_blank'>Democracia en Red</a>
      </p>
      <Link to='/s/terminos-y-condiciones'>Términos y condiciones</Link>
      <span className='spacer'>|</span>
      <a href='http://www.rosario.gov.ar/form/id/contacto_institucional_persona/50' target='_blank' rel='noopener noreferrer'>Contacto</a>
    </div>
    <div className='footer-logos'>
      <a href='http://democraciaenred.org' target='_blank' className='democracy' rel='noopener noreferrer' />
      <a href='https://rosario.gob.ar' target='_blank' className='rosario' rel='noopener noreferrer' />
    </div>
  </footer>
)
