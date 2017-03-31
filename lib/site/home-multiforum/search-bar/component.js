import React, { Component } from 'react'

export default class SearchBar extends Component {
  constructor (props) {
    super(props)
  }
  typing = (e) => {
    this.props.isSearching(e.target.value)
  }

  render () {
    const image = this.props.isLoading ? (<img
      src='https://thomas.vanhoutte.be/miniblog/wp-content/uploads/light_blue_material_design_loading.gif'
      height='50px' />) : null
    return (
      <div>
        <input className='form-control search' type='text' maxLength='100' onKeyUp={this.typing} placeholder='Ingrese su Busqueda' />
        {image}
      </div>
    )
  }
}
