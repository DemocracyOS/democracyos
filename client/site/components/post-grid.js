import React from 'react'
import { stringify } from 'query-string'
import PostCard from './post-card'
import PostFilter from './browse/post-filter'

export default class PostGrid extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      page: 1,
      posts: null,
      count: null
    }
  }

  componentDidMount () {
    window.addEventListener('scroll', this.onScroll, false)
    fetch(`/api/v1.0/posts?page=${this.state.page}`)
      .then((res) => res.json())
      .then((res) => {
        this.setState({
          count: res.pagination.count,
          posts: res.results
        })
      })
      .catch((err) => console.log(err))
  }

  componentWillUnmount () {
    window.removeEventListener('scroll', this.onScroll, false)
  }

  onScroll = () => {
    if (
      (window.innerHeight + window.scrollY) >= (document.body.offsetHeight) &&
      this.state.posts
    ) {
      this.handlePagination()
    }
  }

  handlePagination = () => {
    const nextPage = this.state.page + 1
    const url = `/api/v1.0/posts?page=${nextPage}`
    fetch(url)
      .then((res) => res.json())
      .then((res) => {
        this.setState({
          posts: this.state.posts.concat(res.results),
          page: nextPage
        })
      })
      .catch((err) => console.log(err))
  }

  sort = (field, order) => {
    const query = {
      page: JSON.stringify(1),
      sort: JSON.stringify({ [field]: order })
    }
    const url = `/api/v1.0/posts?${stringify(query)}`
    fetch(url)
      .then((res) => res.json())
      .then((res) => {
        this.setState({
          posts: res.results,
          page: 1
        })
      })
      .catch((err) => console.log(err))
  }

  filterByDate = (openingDate, closingDate) => {
    const datesToArray = [openingDate, closingDate]
    const query = {
      page: JSON.stringify(1),
      filter: JSON.stringify({ openingDate: datesToArray })
    }
    const url = `/api/v1.0/posts?${stringify(query)}`
    fetch(url)
      .then((res) => res.json())
      .then((res) => {
        this.setState({
          posts: res.results,
          page: 1
        })
      })
      .catch((err) => console.log(err))
  }

  render () {
    return (
      <section className='post-grid'>
        <h2>Posts</h2>
        {this.props.filter &&
          <PostFilter sort={this.sort} filterByDate={this.filterByDate} />
        }
        {this.state.posts &&
          <div className='post-grid-card-container'>
            {this.state.posts.map((p, i) =>
              <PostCard post={p}
                key={i} />
            )}
          </div>
        }
        { this.state.posts && this.state.posts.length >= this.state.count &&
          <h5>You have reached all the posts</h5>
        }
        <style jsx>{`
          .post-grid-card-container {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
          }
          h5 {
            margin: 40px 0;
            text-align: center;
          }
          @media screen and (max-width: 767px) {
            .post-grid-card-container {
              justify-content: center;
            }
          }
        `}</style>
      </section>
    )
  }
}