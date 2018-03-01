import React from 'react'
import Link from 'next/link'

const links = [
  {
    name: 'Settings',
    path: '/admin'
  },
  {
    name: 'Profile',
    path: '/'
  },
  {
    name: 'Sign out',
    path: '/'
  }
]

export default () => (
  <nav className='main-menu' role='navigation'>
    <ul className='main-menu-list'>
      {links.map((li, i) =>
        <li key={i}>
          <Link href={li.path}>
            <a>{li.name}</a>
          </Link>
        </li>
      )}
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