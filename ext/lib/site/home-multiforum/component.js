import React from 'react'
import {Link} from 'react-router'
import TweetsFeed from '../tweets-feed/component'

export default function HomeMultiforumOverride (props) {
  return (
    <div>
      <div className='ext-home-cover'>
        <div className='container'>
          <h2>Presupuesto Participativo 2017</h2>
          <h1>En noviembre se votan los proyectos<br/>que van a cambiar tu barrio</h1>
          <Link to='/presupuesto' className='btn call-to-action btn-lg'>
            Conocer los proyectos
          </Link>
        </div>
      </div>
      <div className='intro'>
        <div className='container'>
          <div className='row'>
            <div className='col-md-5'>
              <ul className='light-text'>
                <li>
                  <h4>Ideas</h4>
                  <p>Ciudadanas y ciudadanos de cada distrito desarrollaron propuestas que pueden.</p>
                </li>
                <li>
                  <h4>Proyectos</h4>
                  <p>Ciudadanas y ciudadanos de cada distrito desarrollaron propuestas que pueden convertirse en parte de la planificación de la ciudad.</p>
                </li>
                <li>
                  <h4>Votación</h4>
                  <p>Ciudadanas y ciudadanos de cada distrito desarrollaron propuestas que pueden.</p>
                </li>
                <li>
                  <h4>Financiamiento</h4>
                  <p>Ciudadanas y ciudadanos de cada distrito desarrollaron propuestas que pueden convertirse en parte de la planificación de la ciudad.</p>
                </li>
              </ul>
            </div>
            <div className='col-md-7 hidden-sm-down globos'>
            </div>
          </div>
        </div>
      </div>
      <div className='info'>
        <div className='container'>
          <div className='row'>
            <div className='col-md-6'>
              <span className='en-curso'>En curso (votado en 2015)</span>
              <h2>Presupuesto Participativo 2016</h2>
              <p>Vecinos y vecinas de toda los distritos priorizaron nuevos proyectos para nuestra ciudad. Aquí podés conocer los resultados de la votación!</p>
              <ul className='proyectos-stats'>
                <li>
                  <span className='img'></span>
                  <span className='num'>582</span>
                  <p>Proyectos<br />presentados</p>
                </li>
                <li>
                  <span className='img'></span>
                  <span className='num'>19 millones</span>
                  <p>Presupueso<br />asignado</p>
                </li>
                <li>
                  <span className='img'></span>
                  <span className='num'>218</span>
                  <p>Proyectos<br />elegidos</p>
                </li>
              </ul>
              <Link
                to='
http://www.rosario.gob.ar/web/gobierno/presupuestos/presupuesto-participativo'
                target='_blank'
                rel='noopener noreferrer'
                className='btn ver-mas'>Ver más resultados</Link>
            </div>
            <div className='col-md-6 linea-tiempo'>
              <ul>
                <li>
                  <h4>Marzo 2015</h4>
                  <span>- Presentación de las propuestas</span>
                  <span>- Inicio de la votación</span>
                </li>
                <li>
                  <h4>Junio 2015</h4>
                  <span>- Presentación de las propuestas</span>
                  <span>- Inicio de la votación</span>
                </li>
                <li>
                  <h4>Octubre 2015</h4>
                  <span>- Presentación de las propuestas</span>
                  <span>- Inicio de la votación</span>
                </li>

                <li>
                  <h4>2016</h4>
                  <span>- Ejecución del presupuesto</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <TweetsFeed />
      <footer className='container-fluid'>
        <div className='disclaimer'>
          <p>
            Desarrollado con software libre por la Municipalidad de Rosario y DemocracyOS
          </p>
          <Link to='help'>Términos y condiciones</Link>
          <span className='spacer'>|</span>
          <Link to='help'>Contacto</Link>
        </div>
        <div className='footer-logos'>
          <a href='#' className='democracy'></a>
          <a href='#' className='rosario'></a>
        </div>
      </footer>
    </div>
  )
}
