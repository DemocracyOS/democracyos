import React, { Component } from 'react'
import t from 't-component'
import { Link } from 'react-router'
import topicStore from 'lib/stores/topic-store/topic-store'
import userConnector from 'lib/site/connectors/user'

export class Cause extends Component {
  constructor (props) {
    super(props)

    this.state = {
      showResults: false,
      showLoginMessage: false,
      results: null
    }
  }

  handleSupport = (e) => {
    if (!this.props.user.state.fulfilled) return
    if (this.state.showResults) return

    topicStore.support(this.props.topic.id)
      .catch((err) => { throw err })
  }

  componentWillMount () {
    this.setStateFromProps(this.props)
  }

  componentWillReceiveProps (props) {
    this.setStateFromProps(props)
  }

  static getUserVote (topic, user) {
    if (!user.state.fulfilled) return null
    return topic.action.causeResults.length > 0 && topic.action.causeResults.find((r) => {
      const id = r.author.id || r.author
      return user.state.value.id === id
    })
  }

  setStateFromProps (props) {
    const { topic, user } = props

    const ownVote = Cause.getUserVote(topic, user)

    return this.setState({
      showLoginMessage: false,
      showResults: topic.closed || !!ownVote,
      supported: !!ownVote
    })
  }

  render () {
    if (this.props.user.state.pending) return null

    const { user } = this.props
    const { supported, showResults } = this.state

    return (
      <div className='topics-cause'>
        {
          supported && (
            <button
              className='btn btn-primary'
              disabled='true'>
              {t('topics.actions.cause.done')}
            </button>
          )
        }

        {!showResults && (
          <button
            className='btn btn-primary'
            onClick={this.handleSupport}>
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
