import React, { Component } from 'react'

export default class SearchBar extends Component {
  constructor (props) {
    super(props)
  }
  typing = (e) => {
    this.props.isSearching(e.target.value)
  }

  render () {
    
    if (this.props.isLoading) {
      loading = "form-control search loading"
    }
    else {
      loading = "form-control search"
    }
    return (
      <div>
        <input className={loading} type='text' maxLength='100' onKeyUp={this.typing} autoFocus placeholder='Ingrese su Busqueda' />
        {loading}
      </div>
    )
  }
}