import React, { Component } from 'react'
import t from 't-component'
import { Link } from 'react-router'
import topicStore from 'lib/stores/topic-store/topic-store'
import userConnector from 'lib/site/connectors/user'
import ChangeVote from '../change-vote-button/component'
import CantComment from '../cant-comment/component'
import Required from '../required/component'

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

    const showResults = topic.closed
    const showVoteBox = (user.state.fulfilled && !(showResults && !!selected)) || changingVote
    const showChangeVote = !showResults && !changingVote && !!topic.voted
    const showVoteButton = (user.state.fulfilled && !showResults) && !showChangeVote
    const cantComment = user.state.fulfilled && !topic.privileges.canVote
    const isRequired = !user.state.fulfilled && !showResults

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
                winner={result.winner} />
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
              onClick={this.handlePoll}
              disabled={!this.state.selected}>
              {t('topics.actions.poll.do')}
            </button>
          }
        </div>
        {
          isRequired && (
            <Required />
          )
        }
        {
          cantComment && (
            <CantComment />
          )
        }
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

const ResultBox = ({ winner, selected, percentage, value }) => {
  return (
    <button className={
      'btn btn-default poll-btn show-results' +
      (winner ? ' winner' : '')
    }>
      {selected && <span className='circle icon-check' />}
      <span className='poll-results'>{ percentage }%</span>
      <span className='poll-option-label'>{ value }</span>
      <div className='results-bar' style={{ width: `${percentage}%` }} />
    </button>
  )
}
