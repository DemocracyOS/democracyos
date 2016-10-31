import React, {Component} from 'react'
import {Link} from 'react-router'
import t from 't-component'
import userConnector from 'lib/site/connectors/user'
import AutoGrowTextarea from './autogrow-textarea'

class CommentsForm extends Component {
  constructor (props) {
    super(props)

    this.state = {
      focused: false
    }
  }

  handleFocus = () => {
    this.setState({focused: true})
  }

  handleBlur = (evt) => {
    const textarea = evt.currentTarget
    const val = textarea.value
    this.setState({focused: !!val})
  }

  render () {
    const {
      forum,
      topic,
      userFetch
    } = this.props

    if (userFetch.pending) return null

    if (userFetch.fulfilled && !forum.privileges.canVoteAndComment) {
      return <NotAllowed />
    }

    if (userFetch.rejected) return <NeedsLogin />

    const user = userFetch.value
    const focusedClass = this.state.focused ? 'focused' : ''

    return (
      <div className={`topic-comments-form ${focusedClass}`}>
        <img
          className='avatar'
          src={user.avatar}
          alt={user.fullName} />
        {this.state.focused && (
          <h3 className='name'>{user.displayName}</h3>
        )}
        <AutoGrowTextarea
          className='comments-create'
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          placeholder={t('comments.create.placeholder')}
          maxLength='4096'
          rows='1'
          wrap='soft'
          required />
        {this.state.focused && (
          <button className='btn btn-sm btn-outline-success' type='button'>
            {t('comments.create.publish')}
          </button>
        )}
      </div>
    )
  }
}

function NotAllowed () {
  return (
    <div className='alert alert-warning' role='alert'>
      {t('privileges-alert.not-can-vote-and-comment')}
    </div>
  )
}

function NeedsLogin () {
  const ref = location.pathname + location.search

  return (
    <div className='alert alert-info' role='alert'>
      <span className='icon-bubble' />{' '}
      {t('comments.sign-in-required')}.{' '}
      <Link to={{pathname: '/signin', query: {ref}}}>
        {t('signin.login')}
      </Link>
      {' '}{t('common.or')}{' '}
      <Link to={{pathname: '/signup', query: {ref}}}>
        {t('signin.signup')}
      </Link>
    </div>
  )
}

export default userConnector(CommentsForm)
