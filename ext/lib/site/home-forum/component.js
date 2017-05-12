import React from 'react'
import * as HomeForum from 'lib/site/home-forum/component'
import HomePresupuesto from 'ext/lib/site/home-presupuesto/component'
import HomeConsultas from 'ext/lib/site/home-consultas/component'
import HomeDesafios from 'ext/lib/site/home-desafios/component'
import HomeIdeas from 'ext/lib/site/home-ideas/component'
import HomeVoluntariado from 'ext/lib/site/home-voluntariado/component'

const HomeForumOriginal = HomeForum.default

export default (props) => {
  const name = props.params.forum

  switch (name) {
    case 'presupuesto':
      return <HomePresupuesto {...props} />
    case 'ideas':
      return <HomeIdeas {...props} />
    case 'consultas':
      return <HomeConsultas {...props} />
    case 'desafios':
      return <HomeDesafios {...props} />
    case 'voluntariado':
      return <HomeVoluntariado {...props} />
    default:
      return <HomeForumOriginal {...props} />
  }
}
