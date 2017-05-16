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
    if (!this.props.user.state.fulfilled) return
    if (this.state.showResults) return

    topicStore.support(this.props.topic.id)
      .catch((err) => { throw err })
  }

  render () {
    if (this.props.user.state.pending) return null

    const { user } = this.props
    const { supported, showResults } = this.state

    return (
      <div className='topics-cause'>
        {supported && (
          <button
            className='btn btn-primary'
            disabled='true'>
            <i className='icon-rocket' />
            &nbsp;
            {t('topics.actions.cause.done')}
          </button>
        )}
        {!showResults && (
          <button
            className='btn btn-primary'
            onClick={this.handleSupport}>
            <i className='icon-rocket' />
            &nbsp;
            {t('topics.actions.cause.do')}
          </button>
        )}
        {!user.state.fulfilled && this.state.showLoginMessage && (
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
  <p className='text-mute overlay-vote'>
    <span className='text'>
      {t('proposal-options.must-be-signed-in') + '. '}
      <Link
        to={{
          pathname: '/signin',
          query: { ref: window.location.pathname }
        }}>
        {t('signin.login')}
      </Link>
      <span>&nbsp;{t('common.or')}&nbsp;</span>
      <Link to='/signup'>
        {t('signin.signup')}
      </Link>.
    </span>
  </p>
)
