import React, { Component } from 'react'
import 'whatwg-fetch'
import t from 't-component'
import urlBuilder from 'lib/url-builder'

const stages = [
  {'name': 'votacion-abierta', 'title': 'Votación abierta'},
  {'name': 'votacion-cerrada', 'title': 'Votación cerrada'},
  {'name': 'seguimiento', 'title': 'Seguimiento' }
]

export default class UpdateStage extends Component {
  constructor (props) {
    super (props)
    this.state = {
      visibility: false,
      success: false,
      initialStage: '',
      selectedStage: '',
      savedStage: '',
      disabled: true,
      forum: ''
    }
  }

  componentWillMount () {
    this.setState ({
      initialStage: this.props.forum.extra.stage,
      forum: this.props.forum.id
    })
  }

  chooseStage = (e) => {
    let option = e.target.value
    this.setState({selectedStage: option}, () => {
      if (this.state.selectedStage === this.state.initialStage ) {
        this.setState({disabled: true})
      } else {
        this.setState({disabled: false})
      } 
    })
  }

  changeStage = () => {
    const sendStage = this.state.selectedStage
    fetch('/ext/api/change-stage', {
          method: 'POST',
          credentials: 'same-origin',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({stage: sendStage, forumId: this.state.forum})
    })
    .then((res) => {
      if (res.status === 200) {
        this.setState({
          initialStage: sendStage,
          visibility: true,
          disabled: true,
          success: true
        })
      } else {
        if (res.status == 400) {
          this.setState({
            visibility: true,
            success: false
          })
        }
      }
      setTimeout(() => this.setState({
        visibility: false,
        success: false
        }), 5000)
    })
  }
  
  render () {
    return (
      <div>
        {this.state.visibility &&
          <div className={this.state.success ? 'success-message' : 'error-message'}>
            <p>{ this.state.success ?'Cambio realizado exitosamente.': 'El cambio no pudo ser realizado.'}</p>
          </div>
        }
        <div className='wrapper-select'>
          <div>
            <label className='stage-label'>
              Cambiar fase de Presupuesto Participativo
            </label>
            <select className='select-stage' onChange={this.chooseStage}>
              {stages.map((stage, i)=> {
                if (stage.name === this.state.initialStage) {
                return <option value={stage.name} key={i} selected>{stage.title}</option>
                } else {
                return <option value={stage.name} key={i}>{stage.title}</option>
                }
              })}
            </select>
          </div>
          <button className='btn btn-primary pull-right boton' onClick={this.changeStage} disabled={this.state.disabled}>
            Confirmar
          </button>
        </div>
      </div>
      )
  }
}