import React, {Component} from 'react'

export default class Content extends Component {
  render () {
    function createClauses (clauses) {
      return {
        __html: clauses
          .sort(function (a, b) {
            return a.position > b.position ? 1 : -1
          })
          .map(function (clause) {
            return clause.markup
          })
          .join('')
      }
    }

    return (
      <div className='entry-content topic-article-content'>
        <div
          className='clauses'
          dangerouslySetInnerHTML={createClauses(this.props.clauses)}>
        </div>
      </div>
    )
  }
}
