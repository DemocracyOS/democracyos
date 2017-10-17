import React, { Component } from 'react'
import user from 'lib/user/user.js'
import FormView from 'lib/form-view/form-view'

export default class CompleteProfileRegistry extends Component {
    valueSexo = (s) => {
        let name = ''
        const values = [
            {
                "name": "Femenino",
                "value": "F"            
            },
            {
                "name": "Masculino",
                "value": "M"            
            }
        ]

        values.map(v=> {
            if (s === v.value) { 
                name = v.name
                return name }
        })

        return name
    }

	render() {
  		return (
            <div className='form-group'>
                <label>Tipo de Documento</label>
                <input className='form-control' type='text' disabled='disabled' defaultValue={user.extra.cod_doc}/>
                <label>Número de Documento</label>
                <input className='form-control' type='text' disabled='disabled' defaultValue={user.extra.nro_doc}/>
                <label>Sexo</label>
                <input className='form-control' type='text' disabled='disabled' defaultValue={this.valueSexo(user.extra.sexo)}/>
                <p>Si querés modificar estos datos, comunicate con info@rosario.com</p>
            </div>
        )
  	}
}
