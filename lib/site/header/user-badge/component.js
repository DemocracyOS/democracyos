import React, {Component} from 'react'
import {Link} from 'react-router'
import bus from 'bus'
import t from 't-component'
import config from 'lib/config'
import userConnector from 'lib/site/connectors/user'

class UserBadge extends Component {
  constructor (props) {
    super(props)

    this.state = {
      menuUserBadge: false,
      canChangeTopics: false
    }
    this.setChangeTopicsPermission = this.setChangeTopicsPermission.bind(this)
  }

  componentDidMount () {
    bus.on('forum:change', this.setChangeTopicsPermission)
  }

  componentWillUnmount () {
    bus.off('forum:change', this.setChangeTopicsPermission)
  }

  setChangeTopicsPermission (forum) {
    this.setState({canChangeTopics: (forum && forum.privileges.canChangeTopics)})
  }

  toggleMenu (e) {
    e.preventDefault()
    this.setState({menuUserBadge: !this.state.menuUserBadge})
  }

  render () {
    var menuItemAdmin = null
    if (this.props.user.privileges && this.props.user.privileges.canManage) {
      if (config.multiForum) {
        menuItemAdmin = (
          <li>
            <Link to='/settings/forums'>
              {t('header.forums')}
            </Link>
          </li>
        )
      } else {
        menuItemAdmin = (
          <li className='admin-link'>
            <Link to='/admin'>
              {t('header.admin')}
            </Link>
          </li>
        )
      }
    }
    var classes = 'user-badge pull-right' +
      (this.state.menuUserBadge ? ' active' : '')

    return (
      <div className='user'>
        <div className='notifications-badge'>
          <Link to='/notifications' className='btn notifications'>
            <span className='icon-bell bell'></span>
          </Link>
        </div>
        <div className={classes} onClick={this.toggleMenu.bind(this)}>
          <a href='#' className='btn profile'>
            <img src={this.props.user.avatar} alt='' />
            <span className='name ellipsis'>{this.props.user.firstName}</span>
            <span className='caret'></span>
          </a>
          <ul
            className='dropdown-list'>
            {menuItemAdmin}
            <li className='notifications-li'>
              <Link to='/notifications'>{t('notifications.title')}</Link>
            </li>
            <li>
              <Link to='/settings'>
                {t('header.settings')}
              </Link>
            </li>
            {config.frequentlyAskedQuestions && <li><Link to='/help/faq'>{t('help.faq.title')}</Link></li>}
            {config.termsOfService && <li><Link to='/help/terms-of-service'>{t('help.tos.title')}</Link></li>}
            {config.privacyPolicy && <li><Link to='/help/privacy-policy'>{t('help.pp.title')}</Link></li>}
            {config.glossary && <li><Link to='/help/glossary'>{t('help.glossary.title')}</Link></li>}
            <li>
              <a
                onClick={this.props.handleUserLogout}
                href='#'>
                {t('header.logout')}
              </a>
            </li>
          </ul>
        </div>
      </div>
    )
  }
}

export default userConnector(UserBadge)
