import React, {Component} from 'react'
import config from '../../config/config'
import t from 't-component'

export default class UserBadge extends Component {
  // switchOn () {
  //   bus.on('forum:change', this.updateBadge)
  // }

  // switchOff () {
  //   bus.off('forum:change', this.updateBadge)
  // }

  // updateBadge (forum) {
  //   const el = this.el[0]

  //   if (forum && forum.privileges.canChangeTopics) {
  //     el.classList.add('can-change-forum')
  //   } else {
  //     el.classList.remove('can-change-forum')
  //   }
  // }

  render () {
    var menuItemAdmin
    if (config.multiForum && this.props.user.privileges && this.props.user.privileges.canManage) {
      menuItemAdmin = (
        <li>
          <a href='/settings/forums'>{t('header.forums')}</a>
        </li>
      )
    } else {
      menuItemAdmin = (
        <li className='admin-link'>
          <a href='/admin'>{t('header.admin')}</a>
        </li>
      )
    }

    return (
      <div className='user' style={{color: config.headerFontColor}}>
        <div className='user-wrapper'>
          <div className='notifications-badge pull-left hidden-xs'>
            <a href='/notifications' className='btn notifications'>
              <span className='icon-bell bell'></span>
            </a>
          </div>
          <div className='user-badge pull-right'>
            <a href='#' className='btn profile'>
              <img src={this.props.user.profilePicture()} alt='' />
              <span className='name ellipsis'>{this.props.user.firstName}</span>
              <span className='caret'></span>
            </a>
            <ul className='dropdown-list'>
              {menuItemAdmin}
              <li className='visible-xs'>
                <a href='/notifications'>{t('notifications.title')}</a>
              </li>
              <li>
                <a href='/settings'>{t('header.settings')}</a>
              </li>
              {config.frequentlyAskedQuestions && <li><a href='/help/faq'>{t('help.faq.title')}</a></li>}
              {config.termsOfService && <li><a href='/help/terms-of-service'>{t('help.tos.title')}</a></li>}
              {config.privacyPolicy && <li><a href='/help/privacy-policy'>{t('help.pp.title')}</a></li>}
              {config.glossary && <li><a href='/help/glossary'>{t('help.glossary.title')}</a></li>}
              <li>
                <a href='/logout'>{t('header.logout')}</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    )
  }
}
