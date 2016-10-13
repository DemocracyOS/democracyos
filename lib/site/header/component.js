import React, { Component } from 'react'
import { Link } from 'react-router'
import bus from 'bus'
import user from 'lib/user/user'
import config from 'lib/config'
import UserBadge from './user-badge/component'
import AnonUser from './anon-user/component'

export default class Header extends Component {
  constructor (props) {
    super(props)

    this.state = {
      user: null,
      userForm: null,
      showToggleSidebar: null,
      showSidebar: null,
      links: config.headerLinks && config.headerLinks.length
        ? config.headerLinks
        : [{
          url: config.organizationUrl,
          label: config.organizationName
        }]
    }

    this.onUserStateChange = this.onUserStateChange.bind(this)
    this.onLoadUserForm = this.onLoadUserForm.bind(this)
    this.showToggleSidebarChange = this.showToggleSidebarChange.bind(this)
    this.showSidebarChange = this.showSidebarChange.bind(this)
  }

  componentWillMount () {
    bus.on('user-form:load', this.onLoadUserForm)
    bus.on('sidebar:enable', this.showToggleSidebarChange)
    bus.on('sidebar:show', this.showSidebarChange)
    user.on('loaded', this.onUserStateChange)
    user.on('unloaded', this.onUserStateChange)
  }

  componentWillUnmount () {
    bus.off('user-form:load', this.onLoadUserForm)
    bus.off('sidebar:enable', this.showToggleSidebarChange)
    bus.off('sidebar:show', this.showSidebarChange)
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

  showSidebarChange (bool) {
    this.setState({
      showSidebar: bool
    })
  }

  addLinks (links) { this.setState({links}) }

  render () {
    return (
      <header
        className={
          (config.headerContrast ? 'with-contrast' : '') +
          ' app-header'
        }
        style={{
          color: config.headerFontColor,
          backgroundColor: config.headerBackgroundColor
        }}>

          <a
            href='#'
            id='toggleButton'
            className={!this.state.showToggleSidebar && 'v-hidden'}
            onClick={e => {
              e.preventDefault()
              bus.emit('sidebar:show', !this.state.showSidebar)
            }}>
            <span className='bar-icon'></span>
            <span className='bar-icon'></span>
            <span className='bar-icon'></span>
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
            className='user-nav btn-group'>
            {
              this.state.links.map((link, i) => {
                return (
                  <a
                    href={link.url}
                    key={i}
                    className='login org-url'
                    target='_blank'>
                    <span>{link.label}</span>
                  </a>
                )
              })
            }
            {
              this.state.user
                ? <UserBadge user={this.state.user} />
                : <AnonUser form={this.state.userForm} />
            }
          </div>

      </header>
    )
  }
}
