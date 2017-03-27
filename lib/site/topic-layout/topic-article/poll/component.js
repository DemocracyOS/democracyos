import React, { Component } from 'react'
import t from 't-component'
import { Link } from 'react-router'
import topicStore from 'lib/stores/topic-store/topic-store'
import userConnector from 'lib/site/connectors/user'

export class Poll extends Component {
  constructor (props) {
    super(props)

    this.state = {
      showResults: false
    }
  }

  handlePoll = (option) => (e) => {
    if (!this.props.user.state.fulfilled) return
    if (this.state.showResults) return

    topicStore.poll(this.props.id, option)
      .catch((err) => {
        console.warn('Error on poll setState', err)
      })
  }

  componentWillReceiveProps (props) {
    if (props.closed) this.setState((props, state) => ({ showResults: true }))
    const { user } = props
    if (user.state.fulfilled && !!~props.results.map((r) => r.author.id || r.author).indexOf(user.state.value.id)) {
      this.setState((props, state) => ({ showResults: true }))
    }
  }

  render () {
    if (this.props.user.state.pending) return null
    const { results, options, user } = this.props

    const votesTotal = results.length

    const votesCounts = results.reduce((counts, result) => {
      if (!counts[result.value]) counts[result.value] = 0
      counts[result.value]++
      return counts
    }, {})

    const votesPercentages = {}

    options.forEach((opt) => {
      if (!votesCounts[opt]) votesCounts[opt] = 0
      votesPercentages[opt] = 100 / votesTotal * votesCounts[opt]
    })

    const winnerCount = Math.max(...options.map((opt) => votesCounts[opt]))

    const ownVote = user.state.fulfilled && results.find((r) => {
      return r.author === user.state.value.id
    })

    return (
      <div className='poll-wrapper topic-article-content'>
        {
          options.map((opt, i) => (
            <Option
              key={opt}
              option={opt}
              results={parseFloat(votesPercentages[opt].toFixed(2))}
              winner={winnerCount === votesCounts[opt]}
              voted={opt === (ownVote && ownVote.value)}
              handlePoll={this.handlePoll(opt)}
              showResults={this.state.showResults} />
          ))
        }
        {
          !user.state.fulfilled && (
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
        }
        {
          user.state.fulfilled &&
          !this.props.canVoteAndComment && (
            <p className='text-mute overlay-vote'>
              <span className='icon-lock' />
              <span className='text'>
                {t('privileges-alert.not-can-vote-and-comment')}
              </span>
            </p>
          )
        }
      </div>
    )
  }
}

export default userConnector(Poll)

const Option = ({
  option,
  handlePoll,
  results,
  showResults,
  winner,
  voted
}) => (
  <button
    className={
      'btn btn-default' +
      (showResults ? ' show-results' : '') +
      (winner ? ' winner' : '')
    }
    onClick={handlePoll}>
    {showResults && <span className='poll-results'>{results}%</span> }
    <span className='poll-option-label'>{ option }</span>
    {showResults && voted && <span className='icon-check' />}
    <div className='results-bar' style={{ width: results + '%' }} />
  </button>
)
