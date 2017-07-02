import React, { Component } from 'react'
import t from 't-component'

export default class NotAllowed extends Component {
  render () {
    return (
      <div id='content-401'>
        <div className='container-401'>
          <span className='icon-ban' />
          <h1 className='title'>
            {t('privileges-alert.not-can-view')}
          </h1>
        </div>
      </div>
    )
  }
}
