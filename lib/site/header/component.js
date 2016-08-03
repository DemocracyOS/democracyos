import React, {Component} from 'react'
import t from 't-component'
import user from '../../user/user'
import config from '../../config/config'
import UserBadge from './userBadge.js'
import AnonUser from './anonUser.js'

export default class Header extends Component {
  constructor(props, context) {
    super(props, context)

    this.state = {
      user: null
    }
  }

  componentDidMount () {
    var self = this

    user.on('loaded', function () {
      self.setState({user})
    })

    user.on('unloaded', function () {
      self.setState({user: null})
    })
  }

  render () {
    var userActions = this.state.user ? <UserBadge user={this.state.user} /> : <AnonUser />
    return (
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
    )
  }
}
