import React, {Component} from 'react'
import { Link } from 'react-router'
import user from 'lib/user/user'
import t from 't-component'
import forumStore from '../../stores/forum-store/forum-store'
import ForumCard from './forum-card/component'

export default class HomeMultiForum extends Component {
  constructor (props) {
    super(props)
    this.state = {
      user: null,
      forums: [],
      page: 0,
      loading: false,
      noMore: null
    }
    this.loadPage = this.loadPage.bind(this)
    this.onUserStateChange = this.onUserStateChange.bind(this)
  }

  componentWillMount () {
    user.on('loaded', this.onUserStateChange)
    user.on('unloaded', this.onUserStateChange)
    this.setState({user})
    this.loadPage()
  }

  loadPage () {
    if (this.state.loading) return
    this.setState({loading: true})

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
      console.log('Found error %s', err)
      this.setState({loading: false, noMore: true})
    })
  }

  componentWillUnmount () {
    forumStore.clear()
    user.off('loaded', this.onUserStateChange)
    user.off('unloaded', this.onUserStateChange)
  }

  onUserStateChange () {
    console.log(user)
    this.setState({
      user: user.logged() ? user : null
    })
  }

  render () {
    let info
    if (user.logged()) {
      if (
        user.privileges &&
        user.privileges.canManage &&
        user.privileges.canCreate
      ) {
        info =
        (
          <div className='forum-info cover'>
            <div className='content'>
              <h1>{t('newsfeed.welcome.title')}</h1>
              <p>{t('newsfeed.welcome.body')}</p>
              <a href='/forums/new' className='btn btn-default'>
                {t('newsfeed.call-to-action.start-a-forum')}
                <span className='icon-arrow-right'></span>
              </a>
            </div>
            <a href='/settings/forums' className='admin'>
              {t('newsfeed.call-to-action.manage-forums')}
              <span className='icon-arrow-right'></span>
            </a>
          </div>
        )
      } else if (
        user.privileges &&
        user.privileges.canManage
      ) {
        info =
        (
          <div className='forum-info cover'>
            <div className='content'>
              <h1>{t('newsfeed.welcome.title')}</h1>
              <p>{t('newsfeed.welcome.body')}</p>
              <a href='/forums/new' className='btn btn-default'>
                {t('newsfeed.call-to-action.start-a-forum')}
                <span className='icon-arrow-right'></span>
              </a>
            </div>
          </div>
        )
      } else if (
        user.privileges &&
        user.privileges.canCreate
      ) {
        info =
        (
          <div className='forum-info'>
            <a href='/settings/forums' className='admin'>
              {t('newsfeed.call-to-action.manage-forums')}
              <span className='icon-arrow-right'></span>
            </a>
          </div>
        )
      }
    } else {
      info = (
        <div className='forum-info cover'>
          <div className='content'>
            <h1>{t('newsfeed.welcome.title')}</h1>
            <p>{t('newsfeed.welcome.body')}</p>
            <Link to='/signup' className='btn btn-default'>
              {t('newsfeed.welcome.join')}
              <span className='icon-arrow-right'></span>
            </Link>
          </div>
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
          <section>
            {
              this.state.forums.map((forum, key) => {
                return <ForumCard forum={forum} key={key} />
              })
            }
            {
              this.state.forums.length === 0 &&
              (
                <p className='msg-empty'>
                  {t('newsfeed.nothing-to-show')}
                </p>
              )
            }
          </section>
          <div className={!this.state.noMore ? 'load-more' : 'hide'}>
            <button
              onClick={this.loadPage}
              className={!this.state.loading ? 'btn btn-block' : 'hide'}>
              {t('newsfeed.button.load-more')}
            </button>
            <button
              className={this.state.loading ? 'loader-btn btn btn-block' : 'hide'}>
              <div className='loader'></div>
              {t('newsfeed.button.load-more')}
            </button>
          </div>
        </div>
      </div>
    )
  }
}

