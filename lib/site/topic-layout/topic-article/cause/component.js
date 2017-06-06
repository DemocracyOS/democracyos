import React, { Component } from 'react'
import t from 't-component'
import { Link } from 'react-router'
import topicStore from 'lib/stores/topic-store/topic-store'
import userConnector from 'lib/site/connectors/user'

export class Cause extends Component {
  state = {
    showResults: false,
    showLoginMessage: false,
    results: null
  }

  componentWillMount () {
    this.setStateFromProps(this.props)
  }

  componentWillReceiveProps (props) {
    this.setStateFromProps(props)
  }

  setStateFromProps (props) {
    const { topic } = props

    return this.setState({
      showLoginMessage: false,
      showResults: topic.closed || topic.currentUser.action.supported,
      supported: topic.currentUser.action.supported
    })
  }

  handleSupport = (e) => {
    if (this.state.showResults) return

    if (!this.props.user.state.fulfilled) {
      return this.setState({ showLoginMessage: true })
    }

    topicStore.support(this.props.topic.id)
      .catch((err) => { throw err })
  }

  render () {
    if (this.props.user.state.pending) return null

    const { user } = this.props
    const { supported, showResults, showLoginMessage } = this.state

    return (
      <div className='topics-cause'>
        {supported && (
          <button
            className='btn btn-primary'
            disabled='true'>
            <i className='icon-heart' />
            &nbsp;
            {t('topics.actions.cause.done')}
          </button>
        )}
        {!showLoginMessage && !showResults && (
          <button
            className='btn btn-primary'
            onClick={this.handleSupport}>
            <i className='icon-heart' />
            &nbsp;
            {t('topics.actions.cause.do')}
          </button>
        )}
        {this.state.showLoginMessage && (
          <LoginMessage />
        )}
        {user.state.fulfilled && !this.props.canVoteAndComment && (
          <p className='text-mute overlay-vote'>
            <span className='icon-lock' />
            <span className='text'>
              {t('privileges-alert.not-can-vote-and-comment')}
            </span>
          </p>
        )}
      </div>
    )
  }
}

export default userConnector(Cause)

const LoginMessage = () => (
  <div className='alert alert-info' role='alert'>
    <span className='icon-heart' />{' '}
    {t('proposal-options.must-be-signed-in')}.{' '}
    <Link
      to={{
        pathname: '/signin',
        query: { ref: window.location.pathname }
      }}>
      {t('signin.login')}
    </Link>
    {' '}{t('common.or')}{' '}
    <Link
      to={{
        pathname: '/signup',
        query: { ref: window.location.pathname }
      }}>
      {t('signin.signup')}
    </Link>
  </div>
)
