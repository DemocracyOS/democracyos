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
      user: null,
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
    const className = [
      'app-header'
    ].concat(config.headerContrast ? 'with-contrast' : null).join(' ')

    const styles = {
      color: config.headerFontColor,
      backgroundColor: config.headerBackgroundColor
    }

    return (
      <nav className='navbar navbar-fixed-top' style={styles}>

        <Link
          to={config.homeLink}
          className='navbar-brand hidden-sm-up'>
          <img
            src={config.logoMobile}
            className='d-inline-block align-top'
            height="30" />
        </Link>
        <Link
          to={config.homeLink}
          className='navbar-brand hidden-xs-down'>
          <img
            src={config.logo}
            className='d-inline-block align-top'
            height="30" />
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

          {this.props.userFetch.fulfilled && (
            <UserBadge user={this.props.userFetch.value} />
          )}

          {this.props.userFetch.rejected && (
            <AnonUser form={this.state.userForm} />
          )}
        </ul>
      </nav>
    )
  }
}

export default userConnector(Header)
