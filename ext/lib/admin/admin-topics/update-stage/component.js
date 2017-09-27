import React, { Component } from 'react'
// import 'whatwg-fetch'
import t from 't-component'
// import urlBuilder from 'lib/url-builder'

export default class UpdateStage extends Component {
  constructor (props) {
    super (props)
    this.state = {
      hasError: false,
      success: false
    }
  }

  render () {
    const { forum } = this.props
    return (
      <div>
        <div className='col-md-9 col-xs-12 wrapper-select'>
          <select id='select-stage' className='select-stage'></select>
        </div>
        <div className='col-md-3 col-xs-12 wrapper-button'>
          <button>Confirmar</button>
        </div>
      </div>
      )
  }
}