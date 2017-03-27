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

    topicStore
      .poll(this.props.id, option)
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

    const percentage = (opt) => {
      return ((results.filter((r) => {
        return r.value === opt
      }).length / (results.length || 1)) * 100).toFixed()
    }

    const percentages = options.map((o) => +percentage(o))

    const ownVoteArr = results.filter((r) => {
      return r.author.id || r.author === user.state.value.id
    })

    const ownVote = (ownVoteArr.length === 0) ? null : ownVoteArr[0].value
    const winner = Math.max(...percentages)

    return (
      <div className='poll-wrapper topic-article-content'>
        {
          options.map((o, i) => (
            <Option
              key={i}
              option={o}
              results={percentages[i]}
              winner={percentages[i] === winner}
              ownVote={ownVote === o}
              handlePoll={this.handlePoll(o)}
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
  ownVote
}) => (
  <button
    className={
      'btn btn-default' +
      (showResults ? ' show-results' : '') +
      (winner ? ' winner' : '')
    }
    onClick={handlePoll}>
    { showResults && <span className='poll-results'>{ results }%</span> }
    <span className='poll-option-label'>{ option }</span>
    { showResults && ownVote && <span className='icon-check' /> }
    <div className='results-bar' style={{ width: results + '%' }} />
  </button>
)
