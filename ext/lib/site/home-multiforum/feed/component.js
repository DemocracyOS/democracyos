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
      return <TopicLink url={topic.url} key={i}><VolunCard forum={forum} topic={topic} /></TopicLink>
    case 'consultas':
      return <TopicLink url={topic.url} key={i}><ConsuCard forum={forum} topic={topic} /></TopicLink>
    case 'presupuesto':
      return <TopicLink url={topic.url} key={i}><PresuCard forum={forum} topic={topic} /></TopicLink>
    case 'desafios':
      return <TopicLink url={topic.url} key={i}><DesafCard forum={forum} topic={topic} /></TopicLink>
    case 'ideas':
      return <TopicLink url={topic.url} key={i}><IdeasCard forum={forum} topic={topic} onVote={(e) => { console.log(e) }} /></TopicLink>
  }
}

const TopicLink = ({ url, children }) => <Link to={url}>{ children }</Link>
