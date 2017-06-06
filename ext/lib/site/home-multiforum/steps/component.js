import React from 'react'
import { Link } from 'react-router'

export default ({ scrollInfo }) => (
  <div className='ext-home-steps'>
    <div className='container'>
      <div className='row'>
        <h2 className='container'>¿Cómo podés participar?</h2>
        <div className='participa-steps'>
          <div className='p-step'>
            <div>
              <span className='num'>1</span>
              <p>Registrate</p>
            </div>
            <Link to='/signin' className='p-text'>
              Hacé click en <Link to='/signin'>Ingresar</Link>,
              completá el formulario y sé
              parte de Rosario Participa.
            </Link>
          </div>
          <div className='p-step' onClick={scrollInfo} style={{ cursor: 'pointer' }}>
            <div>
              <span className='num'>2</span>
              <p>Votá</p>
            </div>
            <p className='p-text'>
              Opiná, proponé y decidí cómo
              querés que sea la ciudad.
            </p>
          </div>
          <div className='p-step'>
            <div>
              <span className='num'>3</span>
              <p>Compartí</p>
            </div>
            <p className='p-text'>
              Compartí en redes sociales
              para que más rosarinos
              puedan aportar sus opiniones.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
)
