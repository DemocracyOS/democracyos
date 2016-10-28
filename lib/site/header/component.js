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
      <header className={className} style={styles}>
        <a
          href='#'
          id='toggleButton'
          className={!this.state.showToggleSidebar && 'v-hidden'}
          onClick={this.handleToggleSidebar}>
          <span className='bar-icon' />
          <span className='bar-icon' />
          <span className='bar-icon' />
        </a>

        <h1 id='logo'>
          <Link to={config.homeLink}>
            <img src={config.logo} className='logo-image logo-desk' />
            <img src={config.logoMobile} className='logo-image logo-mobile' />
          </Link>
        </h1>

        <div
          className='user-nav btn-group'>
          <a
          href={config.organizationUrl}
          className='login org-url'
          rel='noopener noreferrer'
          target='_blank'>
            <span>{config.organizationName}</span>
          </a>

          {this.props.userFetch.fulfilled && (
            <UserBadge user={this.props.userFetch.value} />
          )}

          {this.props.userFetch.rejected && (
            <AnonUser form={this.state.userForm} />
          )}
        </div>

      </header>
    )
  }
}

export default userConnector(Header)
