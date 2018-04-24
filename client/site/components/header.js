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
              <h1>{this.props.settings && this.props.settings.communityName ? this.props.settings.communityName : 'Democracy OS'}</h1>
            </a>
          </Link>
        </div>
        {this.props.session.user &&
          <div className='header-avatar-container'>
            <p>{this.props.session.user.name}</p>
            <div className='avatar' onClick={this.handleMainMenu} />
            {this.state.menu &&
              <Menu session={this.props.session} />
            }
          </div>
        }
        {!this.props.session.user &&
          <div>
            <Link href='/auth'>
              <a className='btn btn-primary'>
                Sign in
              </a>
            </Link>
          </div>
        }
        <style jsx>{`
          header {
            height: 100px;
            width: 100%;
            padding: 20px;
            display: flex;
            flex-flow: row wrap;
            justify-content: space-between;
            align-items: center;
          }
          h1 {
            font-size: 36px;
          }
          .header-avatar-container {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
          .avatar {
            margin-left: 20px;
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
  settings: PropTypes.object,
  session: PropTypes.object
}
