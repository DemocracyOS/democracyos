import React, {Component} from 'react'
import { browserHistory, Link } from 'react-router'
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
      window.location = 'forums/new'
    }
    if (config.visibility === 'hidden' && !user.logged()) {
      browserHistory.push('/signin')
    }
    checkReservedNames(this.props.params.forumName)

    let forumName = config.multiForum
      ? this.props.params.forumName
      : config.defaultForum
    this.setState({loading: true})
    forumStore
      .findOneByName(forumName)
      .catch(err => {
        if (err.status === 404) browserHistory.push('/404')
        if (err.status === 401) browserHistory.push('/401')
      })
      .then(forum => {
        if (!forum) return browserHistory.push('/404')
        topicStore
          .findAll({forum: forum.id})
          .catch(err => { console.warn(err) })
          .then(topics => {
            this.setState({
              loading: false,
              forum,
              topics
            })
          })
      })
  }

  render () {
    if (!this.state.forum) return null
    return (
          <div id='forum-home'>
            <div
              className={
                  this.state.forum.coverUrl
                    ? 'cover-img'
                    : 'cover'
                }
                style={
                this.state.forum.coverUrl &&
                  {
                    backgroundImage: 'url("' + this.state.forum.coverUrl + '")'
                  }
              }>
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
                      <div className='topic-loader'></div>
                    </div>
                  )
              }
              {
                this.state.topics.length === 0 &&
                user.privileges &&
                user.privileges.canManage &&
                  (
                    <Link
                      className='btn btn-primary'
                      to={
                        urlBuilder
                          .admin({name: this.props.forumName}) +
                        '/topics/create'
                      }>
                      {t('homepage.create-debate')}
                    </Link>
                  )
              }
              {
                this.state.topics.length > 0 &&
                this.state.topics
                  .map(topic => {
                    return <TopicCard
                      key={topic.id}
                      topic={topic} />
                  })
              }
            </div>
          </div>

    )
  }
}
