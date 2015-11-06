/**
 * Module Dependencies
 */

import o from 'component-dom'
import page from 'page'
import t from 't-component'
import title from '../title/title.js'
import Notifications from './view.js'

page('/notifications', notificationsMiddleware, (ctx, next) => {
  o(document.body).addClass('notifications-page')
  // Update page's title
  title(t('notifications.title'))

  // Empty container and render form
  const notifications = new Notifications(ctx.notifications)
  notifications.replace('#content')

  notifications.find('table tr').on('click', function() {
    const url = o(this).attr('data-url')
    page(url)
  })
})

function notificationsMiddleware(ctx, next) {
  setTimeout(() => {
    ctx.notifications = [{
      text: 'Someone replied to your comment',
      buttonIcon: 'glyphicon-comment',
      when: '5 hours ago',
      avatar: 'https://secure.gravatar.com/avatar/ff34dd3c0477cc61dde1cb3a265cdbc8?d=mm',
      url: '/testy/topic/5637c25420ab6bda090e8759'
    },
    {
      text: 'New topic "fdsafsadfdsa"',
      buttonIcon: 'glyphicon-exclamation-sign',
      when: '1 day ago',
      url: '/testy/topic/5637c25420ab6bda090e8759'
    }]
    next()    
  }, 500)
}