import React from 'react'
import t from 't-component'

const CantComment = () => (
  <p className='text-mute overlay-vote'>
    <span className='icon-lock' />
    <span className='text'>
      {t('privileges-alert.not-can-vote-and-comment')}
    </span>
  </p>
)

export default CantComment
