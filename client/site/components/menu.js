import React from 'react'
import PropTypes from 'prop-types'
import { NextAuth } from 'next-auth/client'
import Router from 'next/router'
import Link from 'next/link'

export default class extends React.Component {
  constructor (props) {
    super(props)
    this.handleSignOutSubmit = this.handleSignOutSubmit.bind(this)
  }

  static propTypes () {
    return {
      session: PropTypes.object
    }
  }

  async handleSignOutSubmit (event) {
    event.preventDefault()
    try {
      await NextAuth.signout()
      Router.push('/auth/callback')
    } catch (error) {
      Router.push('/auth/error?action=signout')
    }
  }

  render () {
    return (
      <nav className='main-menu' role='navigation'>
        <ul className='main-menu-list'>
          {this.props.session.user.role === 'admin' &&
            <li>
              <Link href='/admin'>
                <a>Admin</a>
              </Link>
            </li>
          }
          <li>
            <Link href='/auth'>
              <a>Manage account</a>
            </Link>
          </li>
          <li>
            <Link href={{ pathname: '/profile', query: { id: this.props.session.user.id } }}>
              <a>Profile</a>
            </Link>
          </li>
        </ul>
        <form id='signout' method='post' action='/auth/signout' onSubmit={this.handleSignOutSubmit}>
          <input name='_csrf' type='hidden' value={this.props.session.csrfToken} />
          <button type='submit' className='btn btn-outline-secondary'>Sign out</button>
        </form>
        <style jsx>{`
          .main-menu {
            width: 150px;
            position: absolute;
            right: -40px;
            top: 50px;
            background-color: var(--white);
            border: 1px solid var(--light-gray);
            border-radius: 3px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
          }
          .main-menu-list {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: flex-start;
            list-style-type: none;
            margin-bottom: 0;
          }
          .main-menu-list li {
            padding: 7px 15px;
            border-top: solid 1px rgba(0,0,0,.05);
            width: 100%;
          }
          .main-menu-list li:first-child {
            border-top: none;
          }
          .main-menu-list li a {
            font-size: 16px;
            color: var(--gray);
            text-decoration: none;
            margin: 5px 0;
          }
          .main-menu-list li a:hover {
            cursor: pointer;
          }
          .sign-out-button {
            background: var(--white);
            color: var(--gray);
            padding: 0;
          }
          @media screen and (max-width: 767px) {
            .main-menu {
              position: fixed;
              width: 99%;
              left: 0;
              top: 100px;
              margin: 0 2px;
            }
          }
        `}</style>
      </nav>
    )
  }
}
