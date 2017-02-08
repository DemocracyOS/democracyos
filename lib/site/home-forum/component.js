import React, {Component} from 'react'
import {browserHistory, Link} from 'react-router'
import t from 't-component'
import urlBuilder from 'lib/url-builder'
import config from 'lib/config'
import checkReservedNames from 'lib/forum/check-reserved-names'
import forumStore from 'lib/stores/forum-store/forum-store'
import topicStore from 'lib/stores/topic-store/topic-store'
import userConnector from 'lib/site/connectors/user'
import TopicCard from './topic-card/component'

class HomeForum extends Component {
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

    let name = this.props.params.forum

    if (!name && !config.multiForum) {
      name = config.defaultForum
    }

    checkReservedNames(name)

    this.setState({loading: true})

    forumStore
      .findOneByName(name)
      .then((forum) => {
        topicStore.findAll({forum: forum.id})
          .then((topics) => {
            this.setState({
              loading: false,
              forum,
              topics
            })
          })
          .catch((err) => {
            console.warn(err)
          })
      })
      .catch((err) => {
        if (err.status === 404) browserHistory.push('/404')
        if (err.status === 401) browserHistory.push('/401')
      })
  }

  render () {
    if (config.visibility === 'hidden' && this.props.user.state.rejected) {
      browserHistory.push('/signin')
      return null
    }

    if (!this.state.forum) return null
    return (
      <div id='forum-home'>
        <div
          className={'cover' + (this.state.forum.coverUrl ? '' : ' no-img')}
          style={(this.state.forum.coverUrl && {
            backgroundImage: 'linear-gradient(rgba(0,0,0, 0.6), rgba(0,0,0, 0.6)), url("' + this.state.forum.coverUrl + '")'
          }) || null}>
          <div className='cover-content'>
            <h1>{this.state.forum.title}</h1>
            <p>{this.state.forum.summary}</p>
          </div>
        </div>
        {
          this.state.topics.length === 0 &&
          (
            <div className='no-topics'>
              <p>{t('homepage.no-topics')}</p>
              {
                this.state.forum.privileges.canChangeTopics &&
                (
                  <Link
                    className='btn btn-primary'
                    to={urlBuilder.for('admin.topics.create', {forum: this.state.forum.name})}>
                    {t('homepage.create-debate')}
                  </Link>
                )
              }
            </div>
          )
        }
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
            this.state.topics.length > 0 &&
            this.state.topics.map((topic) => {
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

export default userConnector(HomeForum)
