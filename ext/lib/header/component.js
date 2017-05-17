import React, { Component } from 'react'
import { Link, withRouter } from 'react-router'
import moment from 'moment'
import config from 'lib/config'
import userConnector from 'lib/site/connectors/user'
import UserBadge from 'lib/header/user-badge/component'

class Header extends Component {
  constructor (props) {
    super(props)

    this.state = {
      onMobile: window.innerWidth <= 630,
      showMobileNavigation: false
    }
  }

  toggleMobileNavigation = () => {
    this.setState({
      showMobileNavigation: !this.state.showMobileNavigation
    })
  }

  render () {
    return (
      <header className='ext-header'>
        <div className='ext-header-prefix'>
          <a href='http://rosario.gob.ar' rel='noopener noreferrer'>
            <img src='/ext/lib/header/rosarioigual.png' />
          </a>
        </div>
        <div className='ext-header-main'>
          <div className='container-simple'>
            <div className='current-date'>
              <span>{capitalizeFirstLetter(moment().format('dddd D'))}</span>
              <span>{capitalizeFirstLetter(moment().format('MMMM YYYY'))}</span>
            </div>

            <h1 className='logo'>
              <Link to={config.homeLink}>
                <img src={config.logo} />
              </Link>
            </h1>

            {this.props.user.state.fulfilled && (
              <ul className='user-nav nav navbar-nav'>
                <UserBadge />
              </ul>
            )}

            {this.props.user.state.rejected && (
              <Link to='/signin' className='btn btn-primary btn-sm'>
                Ingresar
              </Link>
            )}
          </div>
        </div>
        {!this.state.onMobile && (
          <div className='ext-header-sub'>
            <Navigation />
          </div>
        )}
        {this.state.onMobile && (
          <div
            className='ext-header-sub mobile'
            onClick={this.toggleMobileNavigation}>
            <button
              className='toggle-submenu-btn'
              type='button'>
              <div className='bar-icon' />
              <div className='bar-icon' />
              <div className='bar-icon' />
            </button>
            {this.state.showMobileNavigation && (
              <Navigation onClick={this.toggleMobileNavigation} />
            )}
          </div>
        )}
      </header>
    )
  }
}

const Navigation = withRouter(({ router, onClick }) => (
  <div className='navigation'>
    {Navigation.links.map(({ slug, title }) => (
      <Link
        key={slug}
        className={!~window.location.pathname.indexOf(slug) ? '' : 'active'}
        onClick={onClick}
        to={`/${slug}`}>
        {title}
      </Link>
    ))}
  </div>
))

Navigation.links = [
  { slug: 'consultas', title: 'Consultas' },
  { slug: 'ideas', title: 'Ideas' },
  { slug: 'desafios', title: 'Desafíos' },
  { slug: 'presupuesto', title: 'Presupuesto participativo' },
  { slug: 'voluntariado', title: 'Voluntariado Social' }
]

export default userConnector(Header)

function capitalizeFirstLetter (string) {
  if (!string) return ''
  return string.charAt(0).toUpperCase() + string.slice(1)
}
