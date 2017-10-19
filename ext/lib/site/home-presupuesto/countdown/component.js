import React, { Component } from 'react'

export default class Countdown extends Component {
  
  constructor (props) {
    super (props)

    this.state = {
      closeDate: new Date(2017, 11, 28, 9),
      seconds : 0,
      minutes : 0,
      hours : 0,
      days : 0
    }
    console.log(props)
  }

  componentDidMount() {
    // inicializa el contador
    this.timeInterval = setInterval(
      () => this.tick(),
      1000
    )

  }

  componentWillUnmount() {
    // detiene el contador
    clearInterval(this.timeInterval);
  }

  remainingTime = (date) => {
    // calcula la diferencia de milisegundos entre la fecha de cierre y la de ahora
    let t = Date.parse(date) - Date.parse(new Date())
    // calcula cantidad de tiempo
    let seconds = Math.floor( (t/1000) % 60 );
    let minutes = Math.floor( (t/1000/60) % 60 );
    let hours = Math.floor( (t/(1000*60*60)) % 24 );
    let days = Math.floor( t/(1000*60*60*24) )
    return {
      seconds : seconds,
      minutes : minutes,
      hours : hours,
      days : days
    }
  }

  tick = () => {
    // actualiza el contador
    this.setState(this.remainingTime(this.state.closeDate))
  }


  render () {
    console.log(this.props.stage)
    return (
      <section className='countdown-wrapper'>
        <div className='intro'>
          <div className='circle'></div>
          <div className='text'>
            <h2>Presupuesto Participativo 2018</h2>
            <p>Vos decidís cómo invertir parte del presupuesto de la ciudad. Podés elegir los proyectos que van a cambiar tu barrio y seguir su ejecución.</p>
          </div>
        </div>
        <main className='countdown'>
          <div className='clock'>
            <span className='number'>04</span>
            <span className='caption'>días</span>
          </div>
          <div className='clock'>
            <span className='number'>08</span>
            <span className='caption'>minutos</span>
          </div>
          <div className='clock'>
            <span className='number'>15</span>
            <span className='caption'>horas</span>
          </div>
          <div className='clock'>
            <span className='number'>16</span>
            <span className='caption'>segundos</span>
          </div>
        </main>
        <footer>Para el cierre de la votación</footer>
      </section>
    )
  }
  
}