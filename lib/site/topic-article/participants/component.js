import React, {Component} from 'react'
import t from 't-component'

export default class Participants extends Component {
  render () {
    let count = this.props.participants.length
    let cardinality = count === 1 ? 'singular' : 'plural'
    let more = count > 5
    return (
      <div className='participants-box'>
        <div className='participants-container'>
          <span>
            {count + t('proposal-article.participant.' + cardinality)}
          </span>
          {
            this.props.participants
              .map((parti) => {
                return <div>participant</div>
              })
          }
        </div>
        <a href='#' className={more ? 'view-more hellip' : 'hide'}>&hellip;</a>
      </div>

    )
  }
}
