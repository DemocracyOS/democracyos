import React, { Component } from 'react'
import t from 't-component'
import { Link } from 'react-router'
import topicStore from 'lib/stores/topic-store/topic-store'
import userConnector from 'lib/site/connectors/user'

export class Poll extends Component {
  constructor (props) {
    super(props)

    this.state = {
      showResults: false,
      selected: null
    }
  }

  handlePoll = (e) => {
    if (!this.props.user.state.fulfilled) return
    if (this.state.showResults) return
    if (!this.state.selected) return
    console.log('handle poll')
    topicStore.poll(this.props.topic.id, this.state.selected)
      .catch((err) => {
        console.warn('Error on poll setState', err)
      })
  }

  select = (option) => (e) => {
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

    if (topic.closed || !user.state.fulfilled) {
      return this.setState({ showResults: true })
    }

    const ownVote = this.getOwnVote(props)

    this.setState((props, state) => ({
      showResults: !!ownVote
    }))
  }

  getOwnVote ({ topic, user }) {
    if (!user.state.fulfilled) return null

    return topic.action.pollResults.find((r) => {
      const id = r.author.id || r.author
      return user.state.value.id === id
    })
  }

  render () {
    if (this.props.user.state.pending) return null

    const { topic, user } = this.props

    const results = topic.action.pollResults
    const options = topic.action.pollOptions

    const votesTotal = results.length

    const votesCounts = results.reduce((counts, result) => {
      if (!counts[result.value]) counts[result.value] = 0
      counts[result.value]++
      return counts
    }, {})

    const votesPercentages = {}

    options.forEach((opt) => {
      if (!votesCounts[opt]) votesCounts[opt] = 0
      votesPercentages[opt] = 100 / votesTotal * votesCounts[opt] || 0
    })

    const winnerCount = Math.max(...options.map((opt) => votesCounts[opt]))

    const ownVote = this.getOwnVote(this.props)

    return (
      <div className='poll-wrapper topic-article-content'>
        {
          options.map((opt, i) => (
            <Option
              key={opt}
              option={opt}
              select={!ownVote && this.select}
              selected={this.state.selected === opt}
              results={parseFloat(votesPercentages[opt].toFixed(2))}
              winner={winnerCount === votesCounts[opt]}
              voted={opt === (ownVote && ownVote.value)}
              showResults={this.state.showResults} />
          ))
        }
        {
          !ownVote &&
            <button className='btn btn-default' disabled={!this.state.selected} onClick={this.handlePoll}>Votar</button>
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
  select,
  selected,
  results,
  showResults,
  winner,
  voted
}) => (
  <button
    className={
      'btn btn-default poll-btn' +
      (showResults ? ' show-results' : '') +
      (winner ? ' winner' : '')
    }
    onClick={select && select(option)}>
    {(selected || (showResults && voted)) && <span className='circle icon-check' />}
    {!showResults && <span className='circle' />}
    {showResults && <span className='poll-results'>{results}%</span> }
    <span className='poll-option-label'>{ option }</span>
    <div className='results-bar' style={{ width: results + '%' }} />
  </button>
)
