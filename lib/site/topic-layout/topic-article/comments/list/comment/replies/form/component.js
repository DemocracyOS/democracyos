import React, {Component} from 'react'
import {Link} from 'react-router'
import t from 't-component'
import userConnector from 'lib/site/connectors/user'
import AutoGrowTextarea from 'lib/site/topic-layout/topic-article/comments/form/autogrow-textarea'

class RepliesForm extends Component {
  constructor (props) {
    super(props)

    this.state = RepliesForm.getInitialState()
  }

  static getInitialState () {
    return {
      focused: false,
      loading: false,
      text: '',
      error: null
    }
  }

  componentWillReceiveProps = (nextProps) => {
    const commentsReplying = nextProps.commentsReplying || {}

    if (commentsReplying.pending) {
      this.setState({
        loading: true,
        error: ''
      })
    } else if (commentsReplying.rejected) {
      this.setState({
        loading: false,
        error: t('modals.error.default')
      })
    } else if (commentsReplying.fulfilled) {
      this.setState(RepliesForm.getInitialState())
    }
  }

  handleFocus = () => {
    this.setState({focused: true})
  }

  handleBlur = () => {
    this.setState({focused: !!this.state.text})
  }

  handleTextChange = (evt) => {
    const text = evt.currentTarget.value || ''

    this.setState({
      text: text,
      focused: text ? true : this.state.focused
    })
  }

  handleKeyDown = (evt) => {
    if ((evt.ctrlKey || evt.metaKey) && evt.key === 'Enter') {
      this.handleSubmit(evt)
    }
  }

  handleSubmit = (evt) => {
    evt.preventDefault()
    this.setState({error: ''})
    this.props.onSubmit({text: this.state.text, id: this.props.commentId})
  }

  render () {
    const {
      forum,
      user
    } = this.props

    if (user.state.pending) return null

    if (user.state.fulfilled && !forum.privileges.canVoteAndComment) {
      return <NotAllowed />
    }

    if (user.state.rejected) return <NeedsLogin />

    const userAttrs = user.state.value
    const focusedClass = this.state.focused ? 'focused' : ''

    return (
      <form
        onSubmit={this.handleSubmit}
        id='comments-reply-form'
        className={`reply-comments-form ${focusedClass}`}>
        {this.state.loading && <div className='loader' />}
        <img
          className='avatar'
          src={userAttrs.avatar}
          alt={userAttrs.fullName} />
        {this.state.focused && (
          <h3 className='name'>{userAttrs.displayName}</h3>
        )}
        <AutoGrowTextarea
          className='reply-create'
          value={this.state.text}
          onChange={this.handleTextChange}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          onKeyDown={this.handleKeyDown}
          placeholder={t('comments.arguments.reply')}
          maxLength='4096'
          minLength='1'
          rows='1'
          wrap='soft'
          required='required' />
        {this.state.focused && (
          <div className='actions'>
            <button
              className='btn btn-sm btn-outline-success'
              type='submit'>
              {t('comments.create.publish')}
            </button>
            {this.state.error && (
              <div className='alert alert-danger error' role='alert'>
                {t('modals.error.default')}
              </div>
            )}
          </div>
        )}
      </form>
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
  const ref = `${location.pathname}${location.search}#comments-form`

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

export default userConnector(RepliesForm)
