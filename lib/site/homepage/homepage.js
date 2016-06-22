import debug from 'debug'
import page from 'page'
import dom from 'component-dom'
import { loadCurrentForum } from '../../forum/forum'
import checkReservedNames from '../../forum/check-reserved-names'
import createFirstTopic from './create-first-topic.jade'
import forumRouter from '../../forum-router/forum-router'
import { findTopics, clearTopicStore } from '../../middlewares/topic-middlewares/topic-middlewares'
import topicFilter from '../topic-filter/topic-filter'
import title from '../../title/title'
import { show as showTopic, exit as exitTopic } from '../topic/topic'

const log = debug('democracyos:homepage')

page(forumRouter('/'),
  init,
  checkReservedNames,
  clearTopicStore,
  loadCurrentForum,
  findTopics,
  render
)

function init (ctx, next) {
  document.body.classList.add('newsfeed')
  ctx.content = document.querySelector('#content')
  dom(ctx.content).empty()
  next()
}

function render (ctx) {
  new HomeView({ // eslint-disable-line no-new
    container: ctx.content,
    locals: {
      topics: topicFilter.filter(ctx.topics),
      forum: ctx.forum
    }
  })
}

page.exit(forumRouter('/'), (ctx, next) => {
  document.body.classList.remove('newsfeed')
  next()
}
