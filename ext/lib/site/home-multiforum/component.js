import React from 'react'
import { Link } from 'react-router'
import userConnector from 'lib/site/connectors/user'
import TweetsFeed from '../tweets-feed/component'
import Footer from '../footer/component'
import Anchor from '../anchor'
import Cover from './cover/component'
import Steps from './steps/component'

export default userConnector(({ user }) => {
  return (
    <div className='ext-home-multiforum'>
      <Cover onClick={() => Anchor.goTo('participar')} />
      <Anchor id='participar' />
      <Steps />
      <Anchor className='info'>
        <div className='action action-consulta'>
          <div className='action-img' />
          <div className='action-content'>
            <h3>Consultas</h3>
            <p>Queremos conocer tu opinión sobre diferentes temas. Elegí la mejor opción para la ciudad.</p>
            <Link to='/consultas' className='btn btn-primary btn-lg'>Quiero opinar</Link>
          </div>
        </div>
        <div className='action action-desafio'>
          <div className='action-img' />
          <div className='action-content'>
            <h3>Desafíos</h3>
            <p>Tenemos desafíos como comunidad y podemos resolverlos juntos.</p>
            <Link to='/desafios' className='btn btn-primary btn-lg'>Quiero ser parte</Link>
          </div>
        </div>
        <div className='action action-ideas'>
          <div className='action-img' />
          <div className='action-content'>
            <h3>Ideas</h3>
            <p>¿Tenés ideas para mejorar la vida en la ciudad? Compartilas.</p>
            <Link to='/consultas' className='btn btn-primary btn-lg'>Quiero proponer</Link>
          </div>
        </div>
        <div className='action action-presupuesto'>
          <div className='action-img' />
          <div className='action-content'>
            <h3>Presupuesto participativo</h3>
            <p>Vos decidís cómo invertir parte del presupuesto de la ciudad. Podés elegir los proyectos que van a cambiar tu barrio y seguir su ejecución.</p>
            <Link to='/presupuesto' className='btn btn-primary btn-lg'>Quiero decidir</Link>
          </div>
        </div>
        <div className='action action-voluntariado'>
          <div className='action-img' />
          <div className='action-content'>
            <h3>Voluntariado social</h3>
            <p>Muchas organizaciones sociales buscan tu apoyo! Conocé a quienes trabajan por una ciudad mejor.</p>
            <Link to='/voluntariado' className='btn btn-primary btn-lg'>Quiero sumarme</Link>
          </div>
        </div>
      </Anchor>
      <TweetsFeed />
      <Footer />
    </div>
  )
})
