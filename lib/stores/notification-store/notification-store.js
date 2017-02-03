import urlBuilder from '../../url-builder'
import Store from '../store/store'

class NotificationStore extends Store {
  name () {
    return 'notification'
  }

  parse (notification) {
    notification.url = urlBuilder.for('site.topic', {
      forum: notification.topic.forum.name,
      id: notification.topic.id
    })

    return Promise.resolve(notification)
  }
}

export default new NotificationStore()
