import React, { Component } from 'react'
import user from 'lib/user/user'
import config from 'lib/config/config'
import UserBadge from './user-badge/component'
import AnonUser from './anon-user/component'

export default class Header extends Component {
  constructor (props) {
    super(props)

    this.state = {
      user: null
    }

    this.onUserStateChange = this.onUserStateChange.bind(this)
  }

  onUserStateChange () {
    this.setState({
      user: user.logged() ? user : null
    })
  }

  componentDidMount () {
    user.on('loaded', this.onUserStateChange)
    user.on('unloaded', this.onUserStateChange)
  }

  componentWillUnmount () {
    user.off('loaded', this.onUserStateChange)
    user.off('unloaded', this.onUserStateChange)
  }

  render () {
    var color = config.headerBackgroundColor
    var headerClassName = config.headerContrast ? 'with-contrast' : ''
    var userActions = this.state.user ? <UserBadge user={this.state.user} /> : <AnonUser />
    return (
      <header className={headerClassName + 'app-header'} style={{color: color || 'inherit'}}>
        <div id='header-container'>
          <a href='#' id='toggleButton'>
            <span className='bar-icon' style={{backgroundColor: config.headerFontColor}}></span>
            <span className='bar-icon' style={{backgroundColor: config.headerFontColor}}></span>
            <span className='bar-icon' style={{backgroundColor: config.headerFontColor}}></span>
          </a>
          <h1 id='logo'>
            <a href={config.homeLink}>
              <img src={config.logo} className='logo-image logo-desk' />
              <img src={config.logoMobile} className='logo-image logo-mobile' />
            </a>
          </h1>
          <div className='user-nav btn-group' style={{color: config.headerFontColor}}>
            <a href={config.organizationUrl} className='login' target='_blank'>
              <span>{config.organizationName}</span>
            </a>
            {userActions}
          </div>
        </div>  
      </header>
    )
  }
}
