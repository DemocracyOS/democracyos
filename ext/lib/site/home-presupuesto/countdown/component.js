import React, { Component } from 'react'

export default class Countdown extends Component {
  
  constructor (props) {
    super (props)

    this.state = {
      openDate: new Date(2017, 11, 2, 9),
      closeDate: new Date(2017, 11, 28, 9)
    }
    console.log(props)
  }

  

  remainingDays = (date) => {
    var t = Date.parse(date) - Date.parse(new Date())
    var days = Math.floor( t/(1000*60*60*24) )
    return days
  }

  render () {
    return (
      <div>
        {this.props.stage !== ('votacion-abierta' | 'votacion-cerrada') &&
          <span className='aviso'>La votación va a comenzar en { this.remainingDays(this.state.openDate) } días</span>
        }
        {this.props.stage === 'votacion-abierta' &&
          <span className='aviso'>La votación va a cerrar en { this.remainingDays(this.state.closeDate) } días</span>
        }
      </div>
    )
  }
  
}