import Log from 'debug'
import bus from 'bus'
import render from '../../render/render'
import View from '../../view/view'
import user from '../../user/user'
import forumStore from '../../stores/forum-store/forum-store'
import ForumRow from './forum-row-view'
import template from './template.jade'
import newForumButton from './new-forum-button.jade'

const log = new Log('democracyos:settings-forum:view')

export default class ForumsView extends View {
  /**
   * Creates a profile edit view
   */

  constructor () {
    super(template)
    this.forumsList = this.find('.forums')
    this.load()
  }

  load () {
    forumStore.findAll({ 'privileges.canChangeTopics': true })
      .then((forums) => {
        if (!forums || !forums.length) return this.empty()
        forums.forEach(this.add, this)
      })
      .catch((err) => {
        if (err.status === 404) {
          this.empty()
        } else {
          log('Found Error %s', err)
        }
      })
  }

  add (forum) {
    var row = new ForumRow(forum)
    this.forumsList.append(row.el)
    bus.once(`forum-store:destroy:${forum.id}`, () => {
      row.remove()
      if (!this.forumsList.html()) this.empty()
    })
  }

  empty () {
    this.forumsList.empty()
    if (user.privileges && user.privileges.canCreate) {
      this.forumsList.append(render(newForumButton))
    }
  }
}
