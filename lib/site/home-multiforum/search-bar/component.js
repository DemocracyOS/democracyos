import React, { Component } from 'react'

export default class SearchBar extends Component {
  constructor (props) {
    super(props)
  }
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
      <div className="input-group input-group-md">
        <span className="input-group-addon">Search
          <i className="fa fa-search" aria-hidden="true"/>
        </span>
        <input className={loading + " search"} type='text' maxLength='100' onKeyUp={this.typing} autoFocus placeholder='Ingrese su Busqueda' />
      </div>
    )
  }
}