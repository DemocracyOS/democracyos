import React, { Component } from 'react'
import { Link } from 'react-router'
import t from 't-component'
import debug from 'debug'
import config from 'lib/config'
import urlBuilder from 'lib/url-builder'
import userConnector from 'lib/site/connectors/user'
import forumStore from '../../stores/forum-store/forum-store'
import ForumCard from './forum-card/component'
import SearchBar from './search-bar/component'
import SearchResults from './search-results/component'

const log = debug('democracyos:home-multiforum')

class HomeMultiForum extends Component {
  constructor (props) {
    super(props)

    this.state = {
      forums: [],
      userHasForums: false,
      page: 0,
      loading: false,
      loadingUserForms: false,
      noMore: null,
      isLoadingSearch: false,
      isSearching: false,
      searchResults: [],
      searchPage: 1,
      noMoreResults: false,
      query: null,
      isLoadingLoadMoreSearch: false
    }
  }

  componentWillMount () {
    // Get all forums
    this.setState({ loading: true })

    forumStore.findAll({
      page: this.state.page
    }).then((forums) => {
      this.setState({
        loading: false,
        noMore: forums.length === 0,
        forums: this.state.forums.concat(forums),
        page: this.state.page + 1
      })
    }).catch((err) => {
      log('Forum home fetch error: ', err)
      this.setState({
        loading: false,
        noMore: true
      })
    })

    // Get user forums for permissions checking
    this.getUserForums()
  }

  componentWillUnmount () {
    forumStore.clear()
  }

  handleLoadMore = () => {
    if (this.state.loading) return
    this.setState({ loading: true })
    forumStore.findAll({
      page: this.state.page
    }).then((forums) => {
      let nextState = {
        loading: false,
        page: this.state.page + 1
      }
      if (forums.length === 0) {
        nextState.noMore = true
      } else {
        nextState.forums = this.state.forums.concat(forums)
      }
      this.setState(nextState)
    }).catch((err) => {
      log('Found error %s', err)
      this.setState({ loading: false, noMore: true })
    })
  }

  handleLoadMoreSearch = () => {
    this.setState({ isLoadingLoadMoreSearch: true })

    forumStore.search(this.state.query, this.state.searchPage)
    .then((res) => res.results.forums)
    .then((searchResults) => {
      const nextState = {
        isLoadingLoadMoreSearch: false,
        searchPage: this.state.searchPage + 1
      }

      if (searchResults.length === 0) {
        nextState.noMoreResults = true
      } else {
        nextState.searchResults = this.state.searchResults.concat(searchResults)
      }

      this.setState(nextState)
    })
    .catch((err) => {
      this.setState({
        isLoadingLoadMoreSearch: false,
        noMoreResults: true
      })

      log('Found error %s', err)
    })
  }

  getUserForums = () => {
    this.setState({ loadingUserForms: true })

    forumStore.findAll({
      'privileges.canChangeTopics': true
    }).then((forums) => {
      this.setState({
        userHasForums: forums && forums.length > 0,
        loadingUserForms: false
      })
    }).catch((err) => {
      if (err.status !== 400) throw err
      this.setState({
        userHasForums: false,
        loadingUserForms: false
      })
    })
  }

  isSearching = (text) => {
    clearInterval(this.timer)
    if (text.length > 2) {
      this.timer = setTimeout(this.search.bind(this, text), 500)
    }
    if (text.length === 0) {
      this.setState({ isSearching: false })
    }
  }

  search = (query) => {
    this.setState({
      isLoadingSearch: true,
      query,
      searchPage: 1,
      noMoreResults: false
    })

    forumStore.search(query, this.state.searchPage)
    .then((res) => res.results.forums)
    .then((searchResults) => {
      this.setState({ isSearching: true, searchResults, isLoadingSearch: false, searchPage: this.state.searchPage + 1 })
    })
    .catch((err) => {
      this.setState({ isSearching: true, isLoadingSearch: false })
      log('Found error %s', err)
    })
  }

  render () {
    if (this.state.loadingUserForms) return null
    if (this.props.user.state.pending) return null

    const user = this.props.user.state.value || {}
    const canManage = user.privileges && user.privileges.canManage
    const canCreate = (user.privileges && user.privileges.canCreate) ||
                      (config.multiForum && !config.restrictForumCreation)

    let info
    let section
    if (canCreate) {
      if (this.props.user.state.fulfilled) {
        if (this.state.userHasForums && canManage) {
          info = (
            <div className='forum-info container'>
              <Link to={urlBuilder.for('settings.forums')} className='admin'>
                {t('newsfeed.call-to-action.manage-forums')}
                <span className='icon-arrow-right' />
              </Link>
            </div>
          )
        } else {
          info = (
            <div className='forum-info cover container'>
              <div className='content'>
                <h1>{t('newsfeed.welcome.title')}</h1>
                <p>{t('newsfeed.welcome.body')}</p>
                <Link
                  to={urlBuilder.for('forums.new')}
                  className='btn btn-default'>
                  {t('newsfeed.call-to-action.start-a-forum')}
                  <span className='icon-arrow-right' />
                </Link>
              </div>
            </div>
          )
        }
      } else {
        info = (
          <div className='forum-info cover container'>
            <div className='content'>
              <h1>{t('newsfeed.welcome.title')}</h1>
              <p>{t('newsfeed.welcome.body')}</p>
              <Link to='/signup' className='btn btn-default'>
                {t('newsfeed.welcome.join')}
                <span className='icon-arrow-right' />
              </Link>
            </div>
          </div>
        )
      }
    }

    if (this.state.isSearching) {
      section = (
        <SearchResults isLoading={this.state.isLoadingLoadMoreSearch} noMoreResults={this.state.noMoreResults} forums={this.state.searchResults} handleLoadMoreSearch={this.handleLoadMoreSearch} />
      )
    } else {
      section = (
        <div className='forum-card-container'>
          <section>
            {
              this.state.forums.map((forum, key) => {
                return <ForumCard forum={forum} key={key} />
              })
            }
            {
              this.state.forums.length === 0 &&
              !this.state.loading &&
              (
                <p className='msg-empty'>
                  {t('newsfeed.nothing-to-show')}
                </p>
              )
            }
          </section>
          {!this.state.noMore && (
            <div className='load-more'>
              {!this.state.loading && (
                <button
                  onClick={this.handleLoadMore}
                  className='btn btn-block'>
                  {t('newsfeed.button.load-more')}
                </button>
              )}
              {this.state.loading && (
                <button
                  className='loader-btn btn btn-block'>
                  <div className='loader' />
                  {t('newsfeed.button.load-more')}
                </button>
              )}
            </div>
          )}
        </div>
      )
    }

    return (
      <div id='home-multiforum' className='center-container'>
        {info}
        <div id='forum-list'>
          <div className='title'>
            <h2>{t('newsfeed.title')}</h2>
          </div>
          <SearchBar isLoading={this.state.isLoadingSearch} isSearching={this.isSearching} />
          {section}
        </div>
      </div>
    )
  }
}

export default userConnector(HomeMultiForum)
