import React from 'react'
import {Link} from 'react-router'
import TweetsFeed from '../tweets-feed/component'

export default function HomeMultiforumOverride (props) {
  return (
    <div className='ext-home-multiforum'>
      <div className='ext-home-cover'>
        <div className='container'>
          <h2>Presupuesto Participativo 2017</h2>
          <h1>Votá los proyectos que van<br /> a cambiar tu barrio</h1>
          <Link to='/presupuesto' className='btn call-to-action btn-lg'>
            Quiero decidir
          </Link>
        </div>
      </div>
      <div className='intro'>
        <div className='container'>
          <div className='row'>
            <div className='col-md-6'>
              <p className='light-text'>Del 18 al 28 de noviembre podés elegir un proyecto para tu barrio y uno para tu distrito.</p>
              <p className='light-text'>Y hasta el 29 de noviembre tenés tiempo para votar en el Presupuesto Participativo Joven.</p>
              <p className='light-text'>El presupuesto total es de 207 millones que se dividirá en proyectos para tu barrio y proyectos para jóvenes.</p>
              <p className='light-text'>Los proyectos surgen de las reuniones de Consejos Barriales, fueron presentados por los consejeros electos y trabajados con los equipos del distrito.</p>
            </div>
            <div className='col-md-6 video-container'>
              <div className='video'>
                <iframe src='https://www.youtube.com/embed/j-4NvQnCCC8'></iframe>
              </div>
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
                to='http://www.rosario.gob.ar/web/gobierno/presupuestos/presupuesto-participativo'
                target='_blank'
                rel='noopener noreferrer'
                className='btn ver-mas'>
                Ver más resultados
              </Link>
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
          <Link to='/s/terminos-y-condiciones'>Términos y condiciones</Link>
          <span className='spacer'>|</span>
          <a href='mailto:participa@rosario.gob.ar'>Contacto</a>
        </div>
        <div className='footer-logos'>
          <a href='#' className='democracy'></a>
          <a href='#' className='rosario'></a>
        </div>
      </footer>
    </div>
  )
}
