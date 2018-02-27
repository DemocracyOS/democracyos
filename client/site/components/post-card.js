import React from 'react'
import Link from 'next/link'

export const PostCard = ({ post }) => (
  <div className='post-card'>
    <div className='post-card-body'>
      <Link prefetch href='/'>
        <a>
          <h3>{post.title}</h3>
        </a>
      </Link>
      <Link prefetch href='/'>
        <a>
          <h4>{post.description}</h4>
        </a>
      </Link>
    </div>
    <div className='post-card-footer'>
      <span>{post.author}</span>
      <span>{post.openingDate}</span>
    </div>
    <style jsx>{`
      .post-card {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        align-content: space-between;
        margin: 16px 0;
        padding: 16px;
        height: 258px;
        width: 288px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
      }
      .post-card:hover {
        box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
      }
      .post-card a {
        color: var(--black);
        text-decoration: none;
      }
      .post-card h3 {
        font-size: 1.4rem;
        font-weight: 600;
        line-height: 2.4rem;
      }
      .post-card h4 {
        font-size: 1.0rem;
        color: rgba(0,0,0,.6);
        max-height: 60px;
        overflow: ellipsis;
      }
      .post-card-footer {
        display: flex;
        flex-wrap: wrap;
      }
    `}</style>
  </div>
)
