import React from 'react'
import PropTypes from 'prop-types'
import { stringify } from 'query-string'
import PostCard from './post-card'
import PostFilter from './browse/post-filter'

export default class PostGrid extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      page: 1,
      posts: null,
      count: null,
      sort: false,
      filter: false,
      words: false
    }
  }

  componentDidMount () {
    window.addEventListener('scroll', this.onScroll, false)
    const url = `/api/v1.0/posts?page=${this.state.page}`
    fetch(url)
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

  clearFilter = (filter) => {
    const nextPage = 1
    let url = `/api/v1.0/posts?page=${nextPage}`
    if (this.state.sort || this.state.filter) {
      let query = {}
      query.page = nextPage
      if (this.state.sort && filter !== 'sort') {
        query.sort = this.state.sort
      }
      if (this.state.filter && filter !== 'filter') {
        query.filter = this.state.filter
      }
      url = `/api/v1.0/posts?${stringify(query)}`
    }
    fetch(url)
      .then((res) => res.json())
      .then((res) => {
        this.setState({
          posts: this.state.posts.concat(res.results),
          page: nextPage,
          [filter]: false
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
    if (this.state.sort) {
      query.sort = this.state.sort
    }
    const url = `/api/v1.0/posts?${stringify(query)}`
    fetch(url)
      .then((res) => res.json())
      .then((res) => {
        this.setState({
          posts: res.results,
          page: 1,
          filter: query.filter,
          count: res.pagination.count
        })
      })
      .catch((err) => console.log(err))
  }

  handlePagination = () => {
    const nextPage = this.state.page + 1
    let url = `/api/v1.0/posts?page=${nextPage}`
    if (this.state.sort || this.state.filter) {
      let query = {}
      query.page = nextPage
      if (this.state.sort) {
        query.sort = this.state.sort
      }
      if (this.state.filter) {
        query.filter = this.state.filter
      }
      url = `/api/v1.0/posts?${stringify(query)}`
    }
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

  onScroll = () => {
    if (
      (window.innerHeight + window.scrollY) >= (document.body.offsetHeight) &&
      this.state.posts
    ) {
      this.handlePagination()
    }
  }

  searchByWords = (words) => {
    const query = {
      page: JSON.stringify(1),
      filter: JSON.stringify({ title: words })
    }
    const url = `/api/v1.0/posts?${stringify(query)}`
    fetch(url)
      .then((res) => res.json())
      .then((res) => {
        this.setState({
          posts: res.results,
          page: 1,
          words: query.filter
        })
      })
      .catch((err) => console.log(err))
  }
  sortPosts = (field, order) => {
    const query = {
      page: JSON.stringify(1),
      sort: JSON.stringify({ [field]: order })
    }
    if (this.state.filter) {
      query.filter = this.state.filter
    }
    const url = `/api/v1.0/posts?${stringify(query)}`
    fetch(url)
      .then((res) => res.json())
      .then((res) => {
        this.setState({
          posts: res.results,
          page: 1,
          sort: query.sort
        })
      })
      .catch((err) => console.log(err))
  }

  render () {
    return (
      <section className='post-grid'>
        <h2>Posts</h2>
        {this.props.filter &&
          <PostFilter
            handleSort={this.sortPosts}
            handleFilterByDate={this.filterByDate}
            searchByWords={this.searchByWords}
            clearFilter={this.clearFilter} />
        }
        {this.state.posts &&
          <div className='post-grid-card-container'>
            {this.state.posts.map((p, i) =>
              <PostCard post={p}
                key={i} />
            )}
          </div>
        }
        {this.state.posts && this.state.posts.length === 0 &&
          <h5>Sorry, not posts found</h5>
        }
        { this.state.posts && this.state.posts.length >= this.state.count && this.state.posts.length > 0 &&
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

PostGrid.propTypes = {
  filter: PropTypes.bool
}
