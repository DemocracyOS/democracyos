import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'

const BrowseCard = ({ post }) => (
  <section className='browse-card-wrapper'>
    <div>
      <span>{post.author.name}</span>
      <span>{post.openingDate}</span>
    </div>
    <div className='browse-card-body'>
      <h3>{post.title}</h3>
      {post.description &&
        <h4>{post.description}</h4>
      }
      <Link href={{ pathname: '/post', query: { id: post._id } }}>
        <span>Read more...</span>
      </Link>
    </div>
  </section>
)

BrowseCard.propTypes = {
  post: PropTypes.object.isRequired
}

export default BrowseCard
