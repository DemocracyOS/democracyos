import React from 'react'
import t from 't-component'

function ChangeVote ({ handleClick }) {
  return (
    <div className='row'>
      <button className='mx-auto btn btn-primary' onClick={handleClick}>
        {t('proposal-options.change-vote')}
      </button>
    </div>
  )
}

export default ChangeVote
