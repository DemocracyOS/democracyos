import React from 'react'
import { Link } from 'react-router'

export default () => (
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
            <p className='p-text'>
              Hacé click en <Link to='/signin'>Participá</Link>,
              completá el formulario y sé
              parte de Rosario Participa.
            </p>
          </div>
          <div className='p-step'>
            <div>
              <span className='num'>2</span>
              <p>Votá</p>
            </div>
            <p className='p-text'>
              Elegí, debatí y proponé cómo
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
              para que más vecinos
              puedan aportar sus ideas.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
)
