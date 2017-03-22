import React, { Component } from 'react'
import userConnector from 'lib/site/connectors/user'

class Poll extends Component {
  render () {
    return (
      <div className='poll-wrapper topic-article-content'>
        { this.props.options.map((o, i) => <Option key={i} option={o} />) }
      </div>
    )
  }
}

export default userConnector(Poll)

function Option ({ option }) {
  return (
    <button className='btn btn-default'>
      { option }
    </button>
  )
}
