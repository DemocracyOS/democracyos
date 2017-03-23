import React, { Component } from 'react'
import t from 't-component'
import { Link } from 'react-router'
import topicStore from 'lib/stores/topic-store/topic-store'
import userConnector from 'lib/site/connectors/user'

class Poll extends Component {
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
      .then((result) => {
        this.setState({showResults: true})
        console.log('topic store poll success', result)
      })
      .catch((err) => {
        this.setState({showResults: false})
        console.warn('Error on poll setState', err)
      })
  }

  componentWillReceiveProps (props) {
    if (props.closed) this.setState((props, state) => ({ showResults: true }))
    const { user } = this.props
    if (user.state.fulfilled && !!~this.props.results.map((r) => r.author).indexOf(user.state.value.id)) {
      this.setState((props, state) => ({ showResults: true }))
    }
  }

  render () {
    const { results, options, user } = this.props
    let percentage = (opt) => results.length === 0 ? 0
      : ((results.filter((r) => r.value === opt).length/results.length)*100).toFixed()
    const percentages = options.map((o) => +percentage(o))
    const winner = Math.max(...percentages)

    console.log(percentages)
    console.log(winner)

    return (
      <div className='poll-wrapper topic-article-content'>
        {
          options.map((o, i) => (
            <Option
              key={ i }
              option={ o }
              results={ percentages[i] }
              winner={ percentages[i] === winner }
              handlePoll={ this.handlePoll(o) }
              showResults={ this.state.showResults } />
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
                    query: {ref: window.location.pathname}
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

function Option ({
  option,
  handlePoll,
  results,
  showResults,
  winner
}) {
  return (
    <button
      className={'btn btn-default' + (showResults ? ' show-results' : '') + (winner ? ' winner' : '')}
      onClick={ handlePoll }>
      { showResults && <span className='poll-results'>{ results }%</span> }
      <span className='poll-option-label'>{ option }</span>
      <div
        className='results-bar'
        style={{
          width: results + '%'
        }}>
      </div>
    </button>
  )
}
