import React, { Component } from 'react'

export default class SearchBar extends Component {
  

  typing(e){
  	this.props.isSearching(e.target.value)
  }

  render () {
    let loading = null
    if(this.props.isLoading){
      loading = (<img src="https://thomas.vanhoutte.be/miniblog/wp-content/uploads/light_blue_material_design_loading.gif" height="50px"/>)
    }
    return (
      <div>
        <input  className='form-control search' type='text' maxlength='100' onKeyUp={this.typing} autofocus placeholder='Ingrese su Busqueda'></input>
        {loading}
      </div>
    )
  }
}