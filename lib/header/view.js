import dom from 'component-dom'
import Headroom from 'democracyos-headroom.js'
import user from '../user/user'
import config from '../config/config'
import isMobile from '../is-mobile/is-mobile'
import View from '../view/view'
import snapper from './snapper/snapper'
import UserBadge from './user-badge/view'
import template from './template.jade'

/**
 * Expose HeaderView
 */

export default class HeaderView extends View {
  constructor () {
    super(template)
    this.build()
    this.user = this.el.find('.user')

    if (
      config.warnHTTP &&
      window.location.hostname !== 'localhost' &&
      window.location.hostname !== '127.0.0.1' &&
      window.location.href.split('://')[0] !== 'https'
    ) {
      this.el.find('.ssl-warning').removeClass('hide')
    }
  }

  switchOn () {
    var self = this
    snapper(this.el)

    if (isMobile()) {
      this.headroomBrowser = this.initHeadroom('#browser')
      this.headroomContent = this.initHeadroom('#content')
    }

    user.on('loaded', function () {
      var userBadge = new UserBadge()
      userBadge.replace(self.user)
      self.el.find('.anonymous-user').addClass('hide')
    })

    user.on('unloaded', function () {
      self.user.empty()
      self.el.find('.anonymous-user').removeClass('hide')
    })
  }

  switchOff () {
    snapper.destroy()
    if (this.headroomBrowser) this.headroomBrowser.destroy()
    if (this.headroomContent) this.headroomContent.destroy()
    user.off('loaded')
    user.off('unloaded')
  }

  initHeadroom (scroller) {
    var header = dom('header')[0]
    var aside = dom('aside')
    scroller = dom(scroller)

    var headroom = new Headroom(header, {
      scroller: scroller[0],
      onPin: function () {
        aside.removeClass('content-pinned')
      },
      onUnpin: function () {
        aside.addClass('content-pinned')
      }
    })

    headroom.init()
    return headroom
  }
}
