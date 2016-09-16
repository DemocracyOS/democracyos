import React, { Component } from 'react'
import { Link } from 'react-router'
import bus from 'bus'
import user from 'lib/user/user'
import config from 'lib/config/config'
import UserBadge from './user-badge/component'
import AnonUser from './anon-user/component'

export default class Header extends Component {
  constructor (props) {
    super(props)

    this.state = {
      user: null,
      userForm: null,
      showToggleSidebar: null,
      showSidebar: null
    }

    this.onUserStateChange = this.onUserStateChange.bind(this)
    this.onLoadUserForm = this.onLoadUserForm.bind(this)
    this.showToggleSidebarChange = this.showToggleSidebarChange.bind(this)
  }

  componentWillMount () {
    bus.on('user-form-load', this.onLoadUserForm)
    bus.on('show-toggle-sidebar', this.showToggleSidebarChange)
    user.on('loaded', this.onUserStateChange)
    user.on('unloaded', this.onUserStateChange)
  }

  componentWillUnmount () {
    bus.off('user-form-load', this.onLoadUserForm)
    bus.off('show-toggle-sidebar', this.showToggleSidebarChange)
    user.off('loaded', this.onUserStateChange)
    user.off('unloaded', this.onUserStateChange)
  }

  onUserStateChange () {
    this.setState({
      user: user.logged() ? user : null
    })
  }

  onLoadUserForm (formName) {
    this.setState({
      userForm: formName
    })
  }

  showToggleSidebarChange (bool) {
    this.setState({
      showToggleSidebar: bool
    })
  }

  render () {
    var color = config.headerBackgroundColor
    var headerClassName = config.headerContrast ? 'with-contrast' : ''
    var userActions = this.state.user
      ? <UserBadge user={this.state.user} />
      : <AnonUser form={this.state.userForm} />
    return (
      <header
        className={headerClassName + ' app-header'}
        style={{color: color || 'inherit'}}>

          <a
            href='#'
            id='toggleButton'
            className={!this.state.showToggleSidebar && 'v-hidden'}
            onClick={e => {
              e.preventDefault()
              const bool = !this.state.showSidebar
              this.setState({showSidebar: bool})
              bus.emit('show-sidebar', bool)
            }}>
            <span
              className='bar-icon'
              style={{backgroundColor: config.headerFontColor}}>
            </span>
            <span
              className='bar-icon'
              style={{backgroundColor: config.headerFontColor}}>
            </span>
            <span
              className='bar-icon'
              style={{backgroundColor: config.headerFontColor}}>
            </span>
          </a>

          <h1 id='logo'>
            <Link to={config.homeLink}>
              <img
                src={config.logo}
                className='logo-image logo-desk' />
              <img
                src={config.logoMobile}
                className='logo-image logo-mobile' />
            </Link>
          </h1>

          <div
            className='user-nav btn-group'
            style={{color: config.headerFontColor}}>
            <a
              href={config.organizationUrl}
              className='login org-url'
              target='_blank'>
              <span>{config.organizationName}</span>
            </a>
            {userActions}
          </div>

      </header>
    )
  }
}
