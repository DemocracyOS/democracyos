import React, { Component } from 'react'
import bus from 'bus'
import forumStore from 'lib/stores/forum-store/forum-store'
import topicStore from 'lib/stores/topic-store/topic-store'
import userConnector from 'lib/site/connectors/user'
import Footer from '../footer/component'
import Cover from '../cover'
import TopicCard from './topic-card/component'

class HomeVoluntariados extends Component {
  constructor (props) {
    super(props)

    this.state = {
      forum: null,
      allTopics: null,
      topics: null,
      tagActive: 'ALL',
      tags: ['ALL']
    }
  }

  componentDidMount = () => {
    forumStore.findOneByName('voluntariado')
      .then((forum) => Promise.all([
        forum,
        topicStore.findAll({ forum: forum.id })
      ]))
      .then(([forum, topics]) => {
        const tags = topics
          .map((topic) => topic.tags)
          .reduce((tagsAcc, tags) => {
            if (tags.length > 0) {
              tags.forEach((tag) => {
                if (tag && !~tagsAcc.indexOf(tag)) tagsAcc.push(tag)
              })
            }
            return tagsAcc
          }, [])

        this.setState({
          forum,
          allTopics: topics,
          tags
        }, this.updateTopics)

        bus.on('topic-store:update:all', this.fetchTopics)
      })
      .catch((err) => { throw err })
  }

  componentWillUnmount = () => {
    bus.off('topic-store:update:all', this.fetchTopics)
  }

  fetchTopics = () => {
    topicStore.findAll({ forum: this.state.forum.id })
      .then((topics) => {
        this.setState({ allTopics: topics }, this.updateTopics)
      })
      .catch((err) => { throw err })
  }

  tagsFilterChange = (e) => {
    this.setState({ tagActive: e.target.value }, this.updateTopics)
  }

  updateTopics = () => {
    const topics = this.state.allTopics
      .filter((topic) => {
        return this.state.tagActive === 'ALL' || ~topic.tags.indexOf(this.state.tagActive)
      })

    this.setState({ topics })
  }

  render () {
    const { forum, topics } = this.state

    return (
      <div className='ext-home-voluntariados'>
        <Cover
          background='/ext/lib/site/boot/bg-home-forum.jpg'
          logo='/ext/lib/site/home-multiforum/voluntariado-icono.png'
          title='Voluntariado social'
          description='Muchas organizaciones sociales buscan tu apoyo! \n Conocé a quienes trabajan por una ciudad mejor.' />
        <h2 className='filter'>
          Ver las organizaciones que trabajan sobre
          <select onChange={this.tagsFilterChange}>
            <option value='ALL'>todos los temas</option>
            {this.state.tags.length > 0 && this.state.tags.map((tag) => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
        </h2>
        {topics && topics.length > 0 && (
          <div className='topics-section'>
            <div className='topics-container'>
              {topics.map((topic) => {
                return <TopicCard key={topic.id} forum={forum} topic={topic} />
              })}
            </div>
          </div>
        )}
        <div className='jumbotron add-ong'>
          <div className='container'>
            <h1 className='display-4'>¿Sos una ONG?</h1>
            <p className='lead'>Si queres sumar tu ONG a este listado para poder contactarte con nuevos voluntarios, completá el siguiente formulario.</p>
            <a className='btn btn-primary btn-lg' href='#'>Sumar mi ONG</a>
          </div>
        </div>
        {topics && <Footer />}
      </div>
    )
  }
}

export default userConnector(HomeVoluntariados)
