import React, { Component } from 'react'
import t from 't-component'
import { Link } from 'react-router'
import topicStore from 'lib/stores/topic-store/topic-store'
import userConnector from 'lib/site/connectors/user'

export class Poll extends Component {
  static getResults (topic, userVote) {
    const results = topic.action.results

    const winnerCount = Math.max(...results.map((opt) => opt.percentage))

    return results.map((opt) => Object.assign({
      winner: winnerCount === opt.percentage,
      voted: opt.value === userVote
    }, opt))
  }

  constructor (props) {
    super(props)

    this.state = {
      showResults: false,
      showLoginMessage: false,
      selected: null,
      ownVote: null,
      results: null
    }
  }

  handlePoll = (e) => {
    if (!this.props.user.state.fulfilled) return
    if (this.state.showResults) return
    if (!this.state.selected) return

    topicStore.vote(this.props.topic.id, this.state.selected)
      .catch((err) => { throw err })
  }

  select = (option) => (e) => {
    if (this.props.user.state.rejected) {
      return this.setState({ showLoginMessage: true })
    }

    this.setState({ selected: option })
  }

  componentWillMount () {
    this.setStateFromProps(this.props)
  }

  componentWillReceiveProps (props) {
    this.setStateFromProps(props)
  }

  setStateFromProps (props) {
    const { topic, user } = props

    const ownVote = topic.voted

    return this.setState({
      showLoginMessage: false,
      showResults: topic.status === 'closed' || !!ownVote,
      results: Poll.getResults(topic, ownVote),
      ownVote
    })
  }

  render () {
    if (this.props.user.state.pending) return null

    const { user, topic } = this.props
    const { results, showResults } = this.state

    if (!results) return null

    return (
      <div className='topics-poll'>
        <div className='poll-options'>
          {results.map((result, i) => (
            <Option
              key={i}
              onSelect={!showResults && this.select(result.value)}
              selected={this.state.selected === result.value}
              showResults={this.state.showResults}
              value={result.value}
              percentage={result.percentage}
              winner={result.winner}
              voted={result.voted} />
          ))}
        </div>
        {!showResults && (
          <button
            className='btn btn-primary'
            disabled={!this.state.selected}
            onClick={this.handlePoll}>
            {t('topics.actions.poll.do')}
          </button>
        )}
        {!user.state.fulfilled && this.state.showLoginMessage && (
          <LoginMessage />
        )}
        {user.state.fulfilled && !topic.privileges.canVote && (
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

export default userConnector(Poll)

const Option = ({
  value,
  onSelect,
  selected,
  showResults,
  winner,
  voted,
  percentage
}) => (
  <button
    className={
      'btn btn-default poll-btn' +
      (showResults ? ' show-results' : '') +
      (winner ? ' winner' : '') +
      (!showResults ? ' not-show-results' : '')
    }
    onClick={onSelect}>
    {(selected || (showResults && voted)) && (
      <span className='circle icon-check' />
    )}
    {!showResults && <span className='circle' />}
    {showResults && <span className='poll-results'>{ percentage }%</span>}
    <span className='poll-option-label'>{ value }</span>
    {showResults && (
      <div className='results-bar' style={{ width: `${percentage}%` }} />
    )}
  </button>
)

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
