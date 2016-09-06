import React, {Component} from 'react'
import { Link } from 'react-router'
import user from 'lib/user/user'
import t from 't-component'
import {
  findAll as findAllForums,
  clearForumStore
} from '../../middlewares/forum-middlewares/forum-middlewares'

export default class HomeMultiForum extends Component {
  constructor (props) {
    super(props)

    this.state = {
      user: null,
      forum: null
    }

    this.onUserStateChange = this.onUserStateChange.bind(this)
  }

  componentWillMount () {
    user.on('loaded', this.onUserStateChange)
    user.on('unloaded', this.onUserStateChange)
  }

  componentWillUnmount () {
    user.off('loaded', this.onUserStateChange)
    user.off('unloaded', this.onUserStateChange)
  }

  onUserStateChange () {
    this.setState({
      user: user.logged() ? user : null
    })
  }

  render () {
    let info
    if (user.logged()) {
      info =
      (
        <div className='forum-info'>
          {
            this.state.forum &&
            this.state.forum.length &&
            this.state.user.privileges &&
            this.state.user.privileges.canManage &&
            (
              <div className='content manage'>
                <p>
                  <Link to='/settings/forums'>
                    {t('newsfeed.call-to-action.manage-forums')}
                    <span className='icon-arrow-right'></span>
                  </Link>
                </p>
              </div>
            )
          }
          {
            user.privileges.canCreate &&
            (
              <div className='cover'>
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
          }
        </div>
      )
    } else {
      info = (
        <div className='forum-info'>
          <div className='cover'>
            <div className='content'>
              <h1>{t('newsfeed.welcome.title')}</h1>
              <p>{t('newsfeed.welcome.body')}</p>
              <a href='/signin' className='btn btn-default'>
                {t('newsfeed.welcome.join')}
                <span className='icon-arrow-right'></span>
              </a>
            </div>
          </div>
        </div>
      )
    }
    return (
      <div className='newsfeed-page'>
        {info}
        <div className='content'>
          <div className='title'>
            <h2>{t('newsfeed.title')}</h2>
          </div>
          <section data-forums></section>
          <div className='forum-pagination' data-pagination></div>
            <button className='btn btn-block msg-more'>
              {t('newsfeed.button.load-more')}
            </button>
            <p className='msg-empty'>
              {t('newsfeed.nothing-to-show')}
            </p>
            <div className='loader'></div>
        </div>
      </div>
    )
  }
}

