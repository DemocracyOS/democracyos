import dom from 'component-dom'
import bus from 'bus'
import debug from 'debug'
import page from 'page'
import title from '../../title/title'
import { loadCurrentForum } from '../../forum/forum'
import { findTopics, findTopic } from '../../middlewares/topic-middlewares/topic-middlewares'
import { parallel } from '../../middlewares/utils/utils'
import sidebar from '../sidebar/sidebar'
import Article from '../proposal-article/proposal-article'
import Options from '../proposal-options/proposal-options'
import Comments from '../comments-view/view'
import forumRouter from '../../forum-router/forum-router.js'
import PrivilegesAlert from './privileges-alert/privileges-alert'

const log = debug('democracyos:topic:page')

export function show (topic, forum = {}) {
  window.analytics.track('view topic', {topic: topic.id})
  bus.emit('page:render', topic.id)

  sidebar.select(topic.id)
  const content = dom('section.app-content')

  // Clean page's content
  dom('#content').empty()
  content.empty()

  // Build article's content container
  // and render to section.app-content
  let article = new Article(topic)
  article.appendTo(content)

  // Build article's meta
  // and render to section.app-content
  if (topic.votable) {
    let options = new Options({
      proposal: topic,
      canVote: forum.privileges ? forum.privileges.canVoteAndComment : true
    })
    options.appendTo(content)
  }

  // Show a message dependending on the privileges the user has.
  renderPrivileges(forum, content[0])

  // Build article's comments, feth them
  // and render to section.app-content
  let comments = new Comments({
    canComment: forum.privileges ? forum.privileges.canVoteAndComment : true,
    topic
  })
  comments.appendTo(content)
  comments.initialize()

  document.body.classList.add('browser-page')
}

export function exit () {
  title()

  const content = dom('section.app-content')

  content.empty()

  // scroll to top
  dom('section#browser').scrollTop = 0

  document.body.classList.remove('browser-page')
}

page(forumRouter('/topic/:id'),
  loadCurrentForum,
  parallel(findTopics, findTopic),
  (ctx, next) => {
    log(`rendering Topic ${ctx.params.id}`)

    if (!ctx.topic) {
      log('Topic %s not found', ctx.params.id)
      return next()
    }

    show(ctx.topic, ctx.forum)

    title(ctx.topic.mediaTitle)

    log('render %s', ctx.params.id)
  }
)

page.exit(forumRouter('/topic/:id'), (ctx, next) => {
  exit()
  next()
})

function renderPrivileges (forum, content) {
  return new PrivilegesAlert({
    privileges: forum.privileges,
    visibility: forum.visibility,
    container: content
  })
}
