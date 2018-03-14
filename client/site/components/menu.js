import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'

export const Menu = ({ userId }) => (
  <nav className='main-menu' role='navigation'>
    {console.log(userId)}
    <ul className='main-menu-list'>
      <li>
        <Link href='/admin'>
          <a>Settings</a>
        </Link>
      </li>
      <li>
        <Link href={{ pathname: '/profile', query: { id: userId } }}>
          <a>Profile</a>
        </Link>
      </li>
      <li>
        <Link href='/'>
          <a>Sign Out</a>
        </Link>
      </li>
    </ul>
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

Menu.propTypes = {
  userId: PropTypes.string
}
