import React, { Component } from 'react'
import topicStore from 'lib/stores/topic-store/topic-store'
import userConnector from 'lib/site/connectors/user'

class Poll extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showResults: false,
      topic: null
    }
  }

  handlePoll = (option) => (e) => {
    if (!this.props.user.state.fulfilled) return

    let voteValue = option
    topicStore
      .poll(this.props.id, voteValue)
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
    if (props.closed) this.setState({showResults: true})
  }

  render () {
    const { results, options } = this.props
    let percentage = (opt) => results.length === 0 ? 0
      : ((results.filter((r) => r.value === opt).length/results.length)*100).toFixed()
    return (
      <div className='poll-wrapper topic-article-content'>
        { options.map((o, i) => (
            <Option
              key={ i }
              option={ o }
              results={ percentage(o) }
              handlePoll={ this.handlePoll(o) }
              showResults={ this.state.showResults } />
          ))
        }
      </div>
    )
  }
}

export default userConnector(Poll)

function Option ({ option, handlePoll, results, showResults }) {
  return (
    <button
      className={'btn btn-default' + (showResults ? ' show-results' : '') }
      onClick={ handlePoll }>
      { showResults && <span className='poll-results'>{ results }%</span> }
      { option }
    </button>
  )
}
