import React, {Component} from 'react'
import {browserHistory, Link} from 'react-router'
import t from 't-component'
import urlBuilder from 'lib/url-builder/url-builder'
import user from 'lib/user/user'
import config from 'lib/config/config'
import checkReservedNames from 'lib/forum/check-reserved-names'
import forumStore from 'lib/stores/forum-store/forum-store'
import topicStore from 'lib/stores/topic-store/topic-store'
import TopicCard from './topic-card/component'

export default class HomeForum extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: null,
      topics: null,
      forum: null
    }
  }

  componentWillMount () {
    if (!config.multiForum && !config.defaultForum) {
      window.location = '/forums/new'
    }

    if (config.visibility === 'hidden' && !user.logged()) {
      browserHistory.push('/signin')
    }

    checkReservedNames(this.props.params.forumName)

    const forumName = config.multiForum ?
      this.props.params.forumName :
      config.defaultForum

    this.setState({loading: true})

    forumStore
      .findOneByName(forumName)
      .then(forum => {
        topicStore.findAll({forum: forum.id})
          .then(topics => {
            this.setState({
              loading: false,
              forum,
              topics
            })
          })
          .catch(err => {
            console.warn(err)
          })
      })
      .catch(err => {
        if (err.status === 404) browserHistory.push('/404')
        if (err.status === 401) browserHistory.push('/401')
      })
  }

  render () {
    if (!this.state.forum) return null
    return (
      <div id='forum-home'>
        <div
          className='cover'
          style={this.state.forum.coverUrl && {
            backgroundImage: 'linear-gradient(rgba(255,255,255, 0.5), rgba(255,255,255, 0.6)), url("' + this.state.forum.coverUrl + '")'
          }}
        >
          <div className='cover-content'>
            <h1>{this.state.forum.title}</h1>
            <p>{this.state.forum.summary}</p>
          </div>
        </div>
        <div className='topics-container'>
          {
            this.state.loading &&
            (
              <div className='loader-wrapper'>
                <div className='topic-loader' />
              </div>
            )
          }
          {
            this.state.topics.length === 0 &&
            this.state.forum.privileges.canChangeTopics &&
            (
              <Link
                className='btn btn-primary'
                to={`${urlBuilder.admin(this.state.forum)}/topics/create`}
              >
                {t('homepage.create-debate')}
              </Link>
            )
          }
          {
            this.state.topics.length === 0 &&
            !this.state.forum.privileges.canChangeTopics &&
            (<p>{t('homepage.no-topics')}</p>)
          }
          {
            this.state.topics.length > 0 &&
            this.state.topics.map(topic => {
              return (
                <TopicCard
                  key={topic.id}
                  topic={topic} />
              )
            })
          }
        </div>
      </div>
    )
  }
}
