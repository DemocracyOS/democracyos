import React, {Component} from 'react'
import {Link} from 'react-router'
import bus from 'bus'
import config from 'lib/config'
import userConnector from 'lib/site/connectors/user'
import UserBadge from './user-badge/component'
import AnonUser from './anon-user/component'

class Header extends Component {
  constructor (props) {
    super(props)

    this.state = {
      userForm: null,
      showToggleSidebar: null,
      showSidebar: null
    }
  }

  componentWillMount () {
    bus.on('user-form:load', this.onLoadUserForm)
    bus.on('sidebar:enable', this.showToggleSidebarChange)
    bus.on('sidebar:show', this.showSidebarChange)
  }

  componentWillUnmount () {
    bus.off('user-form:load', this.onLoadUserForm)
    bus.off('sidebar:enable', this.showToggleSidebarChange)
    bus.off('sidebar:show', this.showSidebarChange)
  }

  onLoadUserForm = (formName) => {
    this.setState({
      userForm: formName
    })
  }

  showToggleSidebarChange = (bool) => {
    this.setState({
      showToggleSidebar: bool
    })
  }

  showSidebarChange = (bool) => {
    this.setState({
      showSidebar: bool
    })
  }

  handleToggleSidebar = (evt) => {
    evt.preventDefault()
    bus.emit('sidebar:show', !this.state.showSidebar)
  }

  render () {
    const styles = {
      color: config.headerFontColor,
      backgroundColor: config.headerBackgroundColor
    }

    return (
      <nav className='navbar navbar-fixed-top' style={styles}>
        {
          this.state.showToggleSidebar &&
          (
            <button
              id='toggleButton'
              onClick={this.handleToggleSidebar}>
              <span className='icon-menu' />
            </button>
          )
        }

        <Link
          to={config.homeLink}
          className='navbar-brand hidden-sm-up'>
          <img
            src={config.logoMobile}
            className='d-inline-block align-top'
            height='30' />
        </Link>
        <Link
          to={config.homeLink}
          className='navbar-brand hidden-xs-down'>
          <img
            src={config.logo}
            className='d-inline-block align-top'
            height='30' />
        </Link>

        <ul
          className='nav navbar-nav float-xs-right'>
          <li className='nav-item'>
            <a
              className='nav-link hidden-xs-down'
              href={config.organizationUrl}
              rel='noopener noreferrer'
              target='_blank'>
              {config.organizationName}
            </a>
          </li>

          {this.props.user.state.fulfilled && (
            <li className='nav-item'>
              <Link
                to='/notifications'
                className='nav-link hidden-xs-down'>
                <span className='icon-bell' />
              </Link>
            </li>
          )}

          {this.props.user.state.fulfilled && (
            <UserBadge />
          )}

          {this.props.user.state.rejected && (
            <AnonUser form={this.state.userForm} />
          )}
        </ul>
      </nav>
    )
  }
}

export default userConnector(Header)
