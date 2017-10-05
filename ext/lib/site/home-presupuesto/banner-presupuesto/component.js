import React, { Component } from 'react'

let texts = {
  abierta: {
    title: 'Votá los proyectos del Presupuesto Participativo 2017! Tenés tiempo hasta el xx/xx',
    btn: 'Explorá los proyectos y votá'
  },
  cerrada: {
    title: 'Mirá los resultados de la votación de proyectos del Presupuesto Participativo 2017!',
    btn: 'Ver proyectos'
  },
  seguimiento: {
    title: 'También podés ver el estado de los proyectos ganadores de años anteriores!',
    btn: 'Seguimiento de proyectos anteriores'
  }
}
export default class BannerPresupuesto extends Component {

  constructor (props) {
    super(props)
    this.state={
      visibility: false,
      firstTime: true
    }
    this.limit = window.innerHeight
    this.didScroll = false
  }

  componentDidMount (){
    window.addEventListener('scroll', this.checkScroll)
  }

  componentWillUnmount () {
    window.removeEventListener('scroll', this.checkScroll)
  }

  checkScroll = () => {
    if (document.body.scrollTop > this.limit) this.didScroll = true
    if (document.body.scrollTop < this.limit && this.didScroll && this.state.firstTime){
      this.setState({
        visibility: true,
        firstTime: false
      })
    }
  }

  closeBanner = (event) => {
    this.setState({visibility: false})
  }

  render() {
    let key
    let nextStage
    switch (this.props.stage) {
      case 'seguimiento':
        if (this.props.forumStage === 'votacion-abierta') {
          nextStage = 'votacion-abierta'
          key = 'abierta'
        } else {
          nextStage = 'votacion-cerrada'
          key = 'cerrada'
        }
        break;
      case 'votacion-abierta':
        key = 'seguimiento'
        nextStage = 'seguimiento'
        break;
      case 'votacion-cerrada':
        key = 'seguimiento'
        nextStage = 'seguimiento'
        break;
    }

    return (
      this.state.visibility && (
        <div className='container-banner'>
          <button className='closes' onClick={this.closeBanner}>x</button>
          <h3>
            {texts[key].title}
          </h3>
          <button
            className='btn btn-primary btn-m banner-button'
            onClick={() => {this.props.changeStage(nextStage); this.closeBanner(); this.setState({firstTime: true})}}>
            <span>
              {texts[key].btn}
            </span>
          </button>
        </div>
      )
    )
  }
}
