import React, {Component} from 'react'
import {Link} from 'react-router'
import bus from 'bus'
import config from 'lib/config'
import userConnector from 'lib/site/connectors/user'
import UserBadge from 'lib/site/header/user-badge/component'
import AnonUser from 'lib/site/header/anon-user/component'
import moment from 'moment'

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
    return (
      <header className='ext-site-header'>
        <div className='ext-site-header-prefix hidden-md-down'>
          <div className='container-simple'>
            <Link to='http://rosario.gob.ar'>
              Rosario =
            </Link>
          </div>
        </div>
        <div className='ext-site-header-main'>
          <div className='container-simple'>
            <div className='current-date'>
              <span>{moment().format('dddd D')}</span>
              <span>{moment().format('MMMM YYYY')}</span>
            </div>

            {this.state.showToggleSidebar && (
              <button
                type='button'
                className='toggle-sidebar-btn'
                onClick={this.handleToggleSidebar}>
                <span className='bar-icon' />
                <span className='bar-icon' />
                <span className='bar-icon' />
              </button>
            )}

            <h1 className='logo'>
              <Link to={config.homeLink}>
                <img src={config.logo} />
              </Link>
            </h1>

            <ul className='user-nav nav navbar-nav float-xs-right'>
              {this.props.user.state.fulfilled && (
                <UserBadge />
              )}

              {this.props.user.state.rejected && (
                <AnonUser form={this.state.userForm} />
              )}
            </ul>
          </div>
        </div>
      </header>
    )
  }
}

export default userConnector(Header)
