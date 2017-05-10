import React, { Component } from 'react'
import bus from 'bus'
import forumStore from 'lib/stores/forum-store/forum-store'
import topicStore from 'lib/stores/topic-store/topic-store'
import userConnector from 'lib/site/connectors/user'
import Cover from '../cover'
import TopicCard from './topic-card/component'

class HomeVoluntariados extends Component {
  constructor (props) {
    super(props)

    this.state = {
      forum: null,
      allTopics: null,
      topics: null,
      distritoActive: 'ALL',
      distritos: ['ALL'],
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
        const distritos = topics
          .map((topic) => topic.attrs.district)
          .reduce((distritosAcc, distrito) => {
            if (!~distritosAcc.indexOf(distrito)) distritosAcc.push(distrito)
            return distritosAcc
          }, [])

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
          distritos,
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

  distritoFilterChange = (e) => {
    this.setState({ distritoActive: e.target.value }, this.updateTopics)
  }

  updateTopics = () => {
    const topics = this.state.allTopics
      .filter((topic) => {
        return (
          this.state.distritoActive === 'ALL' ||
          topic.attrs.district === this.state.distritoActive
        ) && (
          this.state.tagActive === 'ALL' ||
          ~topic.tags.indexOf(this.state.tagActive)
        )
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
          description='Las organizaciones sociales son parte central de la vida en nuestra ciudad.'>
        </Cover>
        <div className='container'>
          <p className='sub-sub-title'>Conocelas y sumate como voluntario o <a href='#'>Sumá tu ONG</a>.</p>
        </div>
        <h2 className='filter'>
          Ver las organizaciones en
          <select onChange={this.distritoFilterChange}>
            <option>todos los distritos</option>
            {
              this.state.distritos.length > 0 &&
              this.state.distritos.map((distrito, i) => (
                <option key={i} value={distrito}>Distrito {distrito}</option>
              ))
            }
          </select>
          que trabajan sobre
          <select onChange={this.tagsFilterChange}>
            <option>todos los temas</option>
            {
              this.state.tags.length > 0 &&
              this.state.tags.map((tag, i) => (
                <option key={i} value={tag}>{tag}</option>
              ))
            }
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
      </div>
    )
  }
}

export default userConnector(HomeVoluntariados)
