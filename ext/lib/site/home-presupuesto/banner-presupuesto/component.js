import React, { Component } from 'react'

    let title = ''
    let textButton = ''

export default class BannerPresupuesto extends Component {

    constructor (props) {
    super(props)

    }

    componentWillMount (){
        console.log(this.props.content)
        if (this.props.content == 'archivo') {
            title = 'Votá los proyectos del Presupuesto Participativo 2017! Tenés tiempo hasta el xx/xx'
            textButton = 'Seguimiento de proyectos anteriores'
        }
        if (this.props.content == 'votacion') {
            title = 'También podés ver el estado de los proyectos ganadores de años anteriores!'
            textButton = 'Seguimiento de proyectos anteriores'
        }
    }

    render() {
        return (
            <div className='container-banner'>
                <h3>
                    {title}
                </h3>
                <button className='btn btn-primary btn-m banner-button'>
                    <span>
                        {textButton}
                    </span>
                </button>
            </div> 
        )
    }
}