import React, { Component } from 'react'
import { Link } from 'react-router'
import t from 't-component'
import notificationsStore from '../../stores/notification-store/notification-store'

export default class Notifications extends Component {
  constructor () {
    super()
    this.state = {
      notifications: []
    }
  }

  componentWillMount () {
    return notificationsStore
    .findAll()
    .catch((err) => {
      if (err.status !== 404) throw err
      console.log('Notifications store error', err)
    })
    .then((notifications) => {
      this.setState({ notifications })
    })
  }

  render () {
    return (
      <div className='center-container'>
        <div className='notifications-page'>
          <h1>{t('notifications.title')}</h1>
          {
            this.state.notifications.length > 0 &&
            (
              <div className='notifications-container'>
                {
                  this.state.notifications.map((notification) => {
                    var iconClass = ((type) => {
                      switch (type) {
                        case 'reply':
                          return 'icon-bubble'
                        case 'topic':
                          return 'icon-exclamation'
                        case 'upvote':
                          return 'icon-arrow-up'
                        case 'downvote':
                          return 'icon-arrow-down'
                      }
                    })(notification.type)
                    var verb = ((type) => {
                      switch (type) {
                        case 'reply':
                          return t('notifications.reply.verb')
                        case 'upvote':
                          return t('notifications.upvote.verb')
                        case 'downvote':
                          return t('notifications.downvote.verb')
                        default:
                          return ''
                      }
                    })(notification.type)
                    return (
                      <Link
                        to={notification.url}
                        key={notification.id}
                        className='notification-link'>
                        <span className={'notification-icon ' + iconClass} />
                        <div className='notification-content'>
                          <span className='related-user'>{notification.relatedUser.fullName}</span>
                          <span className='verb'>{verb}</span>
                          <span className='text'>{notification.comment.text}</span>
                          <span className='on'>{t('notifications.on')}</span>
                          <span className='title'>{notification.topic.mediaTitle}</span>
                          <p className='small ago' data-time={notification.createdAt.toString()} />
                        </div>
                        <img src={notification.relatedUser.avatar} />
                      </Link>
                    )
                  })
                }
              </div>
            )
          }
          {
            this.state.notifications.length === 0 &&
            (
              <div className='notifications-empty'>
                <p>{t('notifications.empty')}</p>
              </div>
            )
          }
        </div>
      </div>
    )
  }
}
