import React from 'react'
import { Link } from 'react-router'
import userConnector from 'lib/site/connectors/user'
import TweetsFeed from '../tweets-feed/component'
import Footer from '../footer/component'
import Anchor from '../anchor'
import Cover from './cover/component'
import Steps from './steps/component'

export default userConnector(({ user }) => {
  const coverActionLink = user.state.rejected ? '/#participar' : '/consultas'

  return (
    <div className='ext-home-multiforum'>
      <Cover actionLink={coverActionLink} />
      {user.state.rejected && (
        <Anchor id='participar'>
          <Steps />
        </Anchor>
      )}
      <Anchor className='info' id={user.state.rejected ? '' : 'participar'}>
        <div className='action action-consulta'>
          <div className='action-img' />
          <div className='action-content'>
            <h3>Consultas</h3>
            <h4>La Municipalidad quiere conocer tu opinion sobre diferentes temas</h4>
            <span className='action-separador' />
            <p>Podés votar y decidir qué acciones impulsa la Municipalidad en temáticas culturales, ambientales, sociales.</p>
            <Link to='/consultas' className='btn btn-primary btn-lg'>Quiero opinar</Link>
          </div>
        </div>
        <div className='action action-desafio'>
          <div className='action-img' />
          <div className='action-content'>
            <h3>Desafíos</h3>
            <h4>Tenemos desafíos como comunidad y podemos resolverlos juntos.</h4>
            <span className='action-separador' />
            <p>Sé parte de las politicas de la ciudad: resolvamos en conjunto los desafíos que tenemos.</p>
            <Link to='/desafios' className='btn btn-primary btn-lg'>Quiero ser parte</Link>
          </div>
        </div>
        <div className='action action-presupuesto'>
          <div className='action-img' />
          <div className='action-content'>
            <h3>Presupuesto participativo</h3>
            <h4>Vos podes decidir sobre cómo invertir mas de 200 millones de pesos para la ciudad.</h4>
            <span className='action-separador' />
            <p>Elegí los proyectos que transformarán tu barrio.</p>
            <Link to='/presupuesto' className='btn btn-primary btn-lg'>Quiero votar</Link>
          </div>
        </div>
        <div className='action action-voluntariado'>
          <div className='action-img' />
          <div className='action-content'>
            <h3>Voluntariado social</h3>
            <h4>¡Muchas organizaciones buscan tu apoyo!</h4>
            <span className='action-separador' />
            <p>Conocé las organizaciones sociales que impulsan una ciudad más justa y solidaria y contactate con ellos.</p>
            <Link to='/voluntariado' className='btn btn-primary btn-lg'>Quiero sumarme</Link>
          </div>
        </div>
      </Anchor>
      <TweetsFeed />
      <Footer />
    </div>
  )
})
