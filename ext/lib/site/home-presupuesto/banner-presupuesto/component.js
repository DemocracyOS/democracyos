import React, { Component } from 'react'

export default class BannerPresupuesto extends Component {
    render() {
        return (
            <div className='container-banner'>
                <h3>
                    También podés ver el estado de los proyectos ganadores de años anteriores!
                </h3>
                <button className='btn btn-primary'>
                    Seguimiento de proyectos anteriores
                </button>
            </div> 
        )
    }
}