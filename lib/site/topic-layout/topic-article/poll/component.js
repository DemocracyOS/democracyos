import React, { Component } from 'react'
import t from 't-component'
import { Link } from 'react-router'
import topicStore from 'lib/stores/topic-store/topic-store'
import userConnector from 'lib/site/connectors/user'
import ChangeVote from '../change-vote-button/component'

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
      changingVote: false,
      showLoginMessage: false,
      selected: null,
      results: null

    }
  }

  handlePoll = (e) => {
    if (!this.state.changingVote) {
      if (!this.props.user.state.fulfilled) return
      if (this.state.showResults) return
    }

    if (!this.state.selected) return

    topicStore.vote(this.props.topic.id, this.state.selected)
      .then(() => {
        this.setState((prevState) => ({
          changingVote: false
        }))
      })
      .catch((err) => { throw err })
  }

  select = (option) => (e) => {
    if (this.props.user.state.rejected) {
      return this.setState({ showLoginMessage: true })
    }
    if (this.state.changingVote || this.props.topic.voted === false) {
      this.setState({ selected: option })
    }
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
      results: Poll.getResults(topic, topic.voted),
      selected: topic.voted
    })
  }

  changeVote = () => {
    this.setState({
      changingVote: true
    })
  }

  render () {
    if (this.props.user.state.pending) return null

    const { user, topic } = this.props
    const { results, changingVote, selected } = this.state

    if (!results) return null

    const showResults = (topic.closed && !!topic.voted)
    const showVoteBox = !(topic.closed && !!selected) || changingVote
    const showChangeVote = !(topic.closed || showResults) && !changingVote && !!topic.voted
    const showVoteButton = (showVoteBox && !showResults && changingVote) || topic.voted === false

    return (
      <div className='topics-poll'>
        <div className='poll-options'>
          {
            showResults && results.map((result, i) => (
              <ResultBox
                key={i}
                selected={selected === result.value}
                value={result.value}
                percentage={result.percentage}
                winner={result.winner}
                voted={!!selected} />
            ))
          }
          {
            (showVoteBox && !showResults) && results.map((result, i) => (
              <Option
                key={i}
                onSelect={this.select(result.value)}
                value={result.value}
                selected={selected === result.value} />
            ))
          }
          { showChangeVote && <ChangeVote handleClick={this.changeVote} /> }
          {
            showVoteButton && <button
              className='btn btn-primary'
              onClick={this.handlePoll}>
              {t('topics.actions.poll.do')}
            </button>
          }
        </div>
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

const Option = ({ onSelect, selected, value }) => (
  <button
    className={'btn btn-default poll-btn not-show-results'}
    onClick={onSelect}>
    {selected && <span className='circle icon-check' />}
    {!selected && <span className='circle' />}
    <span className='poll-option-label'>{ value }</span>
  </button>
)

const ResultBox = ({ winner, selected, percentage, value, voted }) => {
  return (
    <button className={
      'btn btn-default poll-btn show-results' +
      (winner ? ' winner' : '')
    }>
      {(selected || voted) && <span className='circle icon-check' />}
      <span className='poll-results'>{ percentage }%</span>
      <span className='poll-option-label'>{ value }</span>
      <div className='results-bar' style={{ width: `${percentage}%` }} />
    </button>
  )
}

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
