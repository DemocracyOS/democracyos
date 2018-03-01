import React from 'react'
import Link from 'next/link'
import PropTypes from 'prop-types'
import Menu from './menu'

export default class Header extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      menu: false
    }
  }

  handleMainMenu = () => {
    this.setState({
      menu: !this.state.menu
    })
  }

  render () {
    return (
      <header>
        <div className='header-title-container'>
          <Link prefetch href='/'>
            <a>
              <h1>{this.props.settings.communityName ? this.props.settings.communityName : 'Default title'}</h1>
            </a>
          </Link>
        </div>
        <div className='header-avatar-container'>
          <div className='avatar' onClick={this.handleMainMenu} />
          {this.state.menu &&
            <Menu />
          }
        </div>
        <style jsx>{`
          header {
            height: 100px;
            width: 100%;
            padding: 20px;
            display: flex;
            flex-flow: row wrap;
            justify-content: space-between;
          }
          header a {
            color: var(--black);
            text-decoration: none;
            cursor: pointer;
          }
          h1 {
            font-size: 36px;
          }
          .header-avatar-container {
            position: relative;
          }
          .avatar {
            width: 35px;
            height: 35px;
            background-color: var(--gray);
            border: 1px solid var(--dark-gray);
            border-radius: 100%;
            cursor: pointer;
          }
        `}</style>
      </header>
    )
  }
}

Header.propTypes = {
  settings: PropTypes.object
}
