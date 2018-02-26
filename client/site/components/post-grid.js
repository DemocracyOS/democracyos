import React from 'react'
import { PostCard } from './post-card'

export class PostGrid extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      posts: ''
    }
  }

  componentDidMount () {
    fetch('/api/v1.0/posts')
      .then((res) => res.json())
      .then((res) => this.setState({posts: res}))
      .catch((err) => console.log(err))
  }

  render () {
    return (
      <section className='post-grid'>
        <h2>Posts</h2>
        {console.log(this.state.posts)}
        {this.state.posts.results &&
          <div className='post-grid-card-container'>
            {this.state.posts.results.map((p, i) =>
              <PostCard post={p}
                key={i} />
            )}
          </div>
        }
        <style jsx>{`
          .post-grid-card-container {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
          }
        `}</style>
      </section>
    )
  }
}