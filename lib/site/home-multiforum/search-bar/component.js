import React, { Component } from 'react'

export default class SearchBar extends Component {
  

  typing(e){
    this.props.isSearching(e.target.value)
  }

  render () {
    let loading = null
    if(this.props.isLoading){
      loading = (<div className='loader'></div>)
    }
    return (
      <div>
        <input  className='form-control search' type='text' maxLength='100' onKeyUp={this.typing} autofocus placeholder='Ingrese su Busqueda'></input>
        {loading}
      </div>
    )
  }
}