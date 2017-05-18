import React from 'react'
import { Link } from 'react-router'

export default () => (
  <footer className='container-fluid ext-footer'>
    <div className='disclaimer'>
      <p>
        Desarrollado con software libre por la Municipalidad de Rosario y <a href='http://democraciaenred.org' rel='noopener noreferrer'>Democracia en Red</a>
      </p>
      <Link to='/s/terminos-y-condiciones'>Términos y condiciones</Link>
      <span className='spacer'>|</span>
      <a href='mailto:participa@rosario.gob.ar'>Contacto</a>
    </div>
    <div className='footer-logos'>
      <a href='http://democraciaenred.org' className='democracy' />
      <a href='https://rosario.gob.ar' className='rosario' />
    </div>
  </footer>
)
