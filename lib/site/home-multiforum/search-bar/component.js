import React, { Component } from 'react'

export default class SearchBar extends Component {
  typing = (e) => {
    this.props.isSearching(e.target.value)
  }

  render () {
    let loading
    if (this.props.isLoading) {
      loading = 'form-control search loading-spinner'
    } else {
      loading = 'form-control search'
    }
    return (
      <div>
        <input className={loading} type='text' maxLength='100' onKeyUp={this.typing} autoFocus placeholder='Ingrese su Busqueda' />
      </div>
    )
  }
}
