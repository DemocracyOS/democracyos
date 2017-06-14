import React, { Component } from 'react'
import { Link } from 'react-router'
import PresuCard from 'ext/lib/site/home-presupuesto/topic-card/component'
import ConsuCard from 'ext/lib/site/home-consultas/topic-card/component'
import DesafCard from 'ext/lib/site/home-desafios/topic-card/component'
import IdeasCard from 'ext/lib/site/home-ideas/topic-card/component'
import VolunCard from 'ext/lib/site/home-voluntariado/topic-card/component'

class Feed extends Component {
  constructor (props) {
    super(props)
    this.state = {
      topics: null,
      forums: null
    }
  }

  componentWillMount () {
    window.fetch(`/ext/api/feed`, { credentials: 'include' })
      .then((res) => res.json())
      .then((res) => {
        if (res.result) {
          this.setState(res.result)
        }
      })
  }

  handleVote (e) {
    console.log(e)
  }

  render () {
    const { topics, forums } = this.state
    let fPresu, tPresu, fConsu, tConsu, fDesaf, tDesaf, fIdeas, tIdeas, fVolun, tVolun

    if (topics && forums) {
      fPresu = forums.find((f) => f.name === 'presupuesto')
      tPresu = topics.find((t) => t.forum === fPresu.id)
      fConsu = forums.find((f) => f.name === 'consultas')
      tConsu = topics.find((t) => t.forum === fConsu.id)
      fDesaf = forums.find((f) => f.name === 'desafios')
      tDesaf = topics.find((t) => t.forum === fDesaf.id)
      fIdeas = forums.find((f) => f.name === 'ideas')
      tIdeas = topics.find((t) => t.forum === fIdeas.id)
      fVolun = forums.find((f) => f.name === 'voluntariado')
      tVolun = topics.find((t) => t.forum === fVolun.id)
    }
    return (
      <div>
        {
          (topics && forums) &&
          (
            <div id='feed'>
              <IdeasCard forum={fIdeas} topic={tIdeas} onVote={this.handleVote} />
              <DesafCard forum={fDesaf} topic={tDesaf} />
              <ConsuCard forum={fConsu} topic={tConsu} />
              <PresuCard forum={fPresu} topic={tPresu} />
              <VolunCard forum={fVolun} topic={tVolun} />
            </div>
          )
        }
      </div>
    )
  }
}

export default Feed
