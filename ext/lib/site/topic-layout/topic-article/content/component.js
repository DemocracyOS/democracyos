import React from 'react'

export default ({ clauses }) => (
  <div
    className='clauses'
    dangerouslySetInnerHTML={createClauses(clauses)} />
)

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
