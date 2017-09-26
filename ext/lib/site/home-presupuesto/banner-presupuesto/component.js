import React, { Component } from 'react'

    let title = ''
    let textButton = ''

export default class BannerPresupuesto extends Component {

    constructor (props) {
        super(props)
        this.state={
            visibility: false,
            firstTime: true
        }
        this.limit=document.body.scrollHeight - 800
        this.didScroll = false
    }

    componentWillMount (){
        if (this.props.content == 'archivo') {
            title = 'Votá los proyectos del Presupuesto Participativo 2017! Tenés tiempo hasta el xx/xx'
            textButton = 'Seguimiento de proyectos anteriores'
        }
        if (this.props.content == 'votacion') {
            title = 'También podés ver el estado de los proyectos ganadores de años anteriores!'
            textButton = 'Seguimiento de proyectos anteriores'
        }

        window.addEventListener('scroll', this.checkScroll) 
    }

    checkScroll = (event) => {
        if (document.body.scrollTop > this.limit){this.didScroll = true}
        if (document.body.scrollTop<this.limit && this.didScroll && this.state.firstTime){
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
        return (
                this.state.visibility && (
                    <div className='container-banner'>
                        <button className='closes' onClick={this.closeBanner}>x</button>
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
        )
    }
}