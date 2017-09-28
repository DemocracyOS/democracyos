import React, { Component } from 'react'
import 'whatwg-fetch'
import t from 't-component'
import urlBuilder from 'lib/url-builder'

const stages = ['Votación abierta', 'Votación cerrada', 'Seguimiento']
export default class UpdateStage extends Component {
  constructor (props) {
    super (props)
    this.state = {
      hasError: false,
      success: false,
      stage: this.props.forum.extra.stage,
      disabled: true
    }
  }

  disabledState = () => {
    if (this.refs.selectStage.value !== this.state.stage) {
      this.setState({disabled: false})
    } else {
      this.setState({disabled: true})
    }
  }

  changeStage = () => { 
    fetch('/ext/api/change-stage', {
          method: 'POST',
          credentials: 'same-origin',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({stage: this.refs.selectStage.value, forumId: this.props.forum.id})
        })
  }
  
  render () {
    return (
      <div className='wrapper-container'>
        <div className='wrapper-select'>
          <label className='stage-label'>
            Cambiar fase de Presupuesto Participativo
          </label>
          <select id='select-stage' className='select-stage' ref='selectStage' onChange={this.disabledState}>
            <option value={this.props.forum.extra.stage}>{this.props.forum.extra.stage}</option>
            {stages.map((stage, i)=> {
              if (this.state.stage != stage) {
               return <option value={stage} key={i}>{stage}</option>
              }
            })}
          </select>
        </div>
        <button className='btn btn-primary pull-right boton' onClick={this.changeStage} disabled={this.state.disabled}>
          Confirmar
        </button>
      </div>
      )
  }
}