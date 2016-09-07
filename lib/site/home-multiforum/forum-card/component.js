import React, {Component} from 'react'
import { Link } from 'react-router'

export default class ForumCard extends Component {
  generateBackground () {

  }
  render () {
    return (
      <Link to={this.props.forum.url}>
        <div className='forum-card'>
          <div className='author'>
            <img
              src={this.props.forum.owner.avatar}
              className='avatar' />
            <span>{this.props.forum.owner.displayName}</span>
          </div>
          <h1>{this.props.forum.title}</h1>
          <p className='desc'>
            {this.props.forum.summary}
          </p>
        </div>
      </Link>
    )
  }
}

