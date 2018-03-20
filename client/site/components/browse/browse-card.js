import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'

const BrowseCard = ({ post }) => (
  <section className='browse-card-wrapper'>
    <div className='browse-card-header'>
      <div className='profile'>
        <Link href={{ pathname: '/profile', query: { id: post.author._id } }}>
          <a>
            <div className='profile-picture' />
          </a>
        </Link>
      </div>
      <div className='post-data'>
        <Link href={{ pathname: '/profile', query: { id: post.author._id } }}>
          <a>
            <span>{post.author.name}</span>
          </a>
        </Link>
        <span>{post.openingDate}</span>
      </div>
    </div>
    <div className='browse-card-body'>
      <Link href={{ pathname: '/post', query: { id: post._id } }}>
        <a>
          <h3>{post.title}</h3>
        </a>
      </Link>
      {post.description &&
        <h4>{post.description}</h4>
      }
    </div>
    <div className='browse-card-footer'>
      <Link href={{ pathname: '/post', query: { id: post._id } }}>
        <a className='browse-card-body-link'>
          <span>Read more...</span>
        </a>
      </Link>
    </div>
    <style jsx>{`
      .browse-card-wrapper {
        margin-bottom: 20px;
        padding: 20px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
      }
      .browse-card-header {
        display: flex;
        align-items: center;
      }
      .browse-card-body {
        margin: 40px 0;
      }
      .browse-card-body h4 {
        font-size: 24px;
        color: rgba(0, 0, 0, 0.54);
      }
      .post-data {
        display: flex;
        flex-wrap: wrap;
        flex-direction: column;
        margin-left: 20px;
      }
      .browse-card-body-link span {
        color: rgba(0, 0, 0, 0.8);
      }
      .profile-picture {
        width: 35px;
        height: 35px;
        background-color: var(--gray);
        border: 1px solid var(--dark-gray);
        border-radius: 100%;
        cursor: pointer;
      }
    `}</style>
  </section>
)

BrowseCard.propTypes = {
  post: PropTypes.object.isRequired
}

export default BrowseCard
