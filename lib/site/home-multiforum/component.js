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
      forums: []
    }

    this.onUserStateChange = this.onUserStateChange.bind(this)
  }

  componentWillMount () {
    user.on('loaded', this.onUserStateChange)
    user.on('unloaded', this.onUserStateChange)
    forumStore
      .findAll()
      .then((forums) => {
        console.log(forums)
        this.setState({forums})
      })
      .catch(err => {
        console.warn(err)
      })
    console.log('moutn newsfeed')
  }

  componentWillUnmount () {
    forumStore.clear()
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
      if (
        this.state.forums &&
        this.state.forums.length &&
        this.state.user.privileges &&
        this.state.user.privileges.canManage
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
      } else if (user.privileges.canCreate) {
        info =
        (
          <div className='forum-info'>
            <a href='/settings/forums'>
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
            <Link to='/signin' className='btn btn-default'>
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
          <div className='load-more hide'>
            <button
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

