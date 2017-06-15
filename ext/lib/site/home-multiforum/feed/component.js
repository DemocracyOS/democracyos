import React, { Component } from 'react'
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
          this.setState({ forums: res.result.forums, topics: res.result.topics.sort(() => 0.5 - Math.random()) })
        }
      })
  }

  handleVote (e) {
    console.log(e)
  }

  render () {
    const { topics, forums } = this.state

    return (
      <div id='feed'>
        {(topics && forums) && (
          <div className='feed-container'>
            { topics.map((topic, i) => topicCard(topic, forums, i)) }
          </div>
        )}
        <div className='feed-shadow'></div>
      </div>
    )
  }
}

export default Feed

function topicCard (topic, forums, i) {
  const forum = forums.find((f) => topic.forum === f.id)
  switch (forum.name) {
    case 'voluntariado':
      return <VolunCard forum={forum} topic={topic} key={i} />
    case 'consultas':
      return <ConsuCard forum={forum} topic={topic} key={i} />
    case 'presupuesto':
      return <PresuCard forum={forum} topic={topic} key={i} />
    case 'desafios':
      return <DesafCard forum={forum} topic={topic} key={i} />
    case 'ideas':
      return <IdeasCard forum={forum} topic={topic} key={i} />
  }
}
