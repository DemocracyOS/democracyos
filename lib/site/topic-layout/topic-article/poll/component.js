import React, { Component } from 'react'
import topicStore from 'lib/stores/topic-store/topic-store'
import userConnector from 'lib/site/connectors/user'

class Poll extends Component {
  handlePoll = (option) => (e) => {
    if (!this.props.user.state.fulfilled) return

    let voteValue = option
    topicStore
      .poll(this.props.id, voteValue)
      .then((result) => {
        console.log('topic store poll success', result)
      })
      .catch((err) => {
        console.warn('Error on poll setState', err)
      })
  }

  render () {
    return (
      <div className='poll-wrapper topic-article-content'>
        { this.props.options.map((o, i) => <Option key={i} option={o} handlePoll={this.handlePoll(o)} />) }
      </div>
    )
  }
}

export default userConnector(Poll)

function Option ({ option, handlePoll }) {
  return (
    <button onClick={handlePoll} className='btn btn-default'>
      { option }
    </button>
  )
}
