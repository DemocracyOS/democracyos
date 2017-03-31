import React, { Component } from 'react'

export default class SearchBar extends Component {
  typing (e) {
    this.props.isSearching(e.target.value)
  }

  render () {
    let loading = null

    if (this.props.isLoading) loading = <div className='loader' />

    return (
      <div>
        <input
          className='form-control search'
          type='text'
          maxLength='100'
          onKeyUp={this.typing}
          autoFocus
          placeholder='Ingrese su Busqueda' />
        {loading}
      </div>
    )
  }
}
