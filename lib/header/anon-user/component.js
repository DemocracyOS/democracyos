import React, { Component } from 'react'
import { Link } from 'react-router'
import t from 't-component'

export default class AnonUser extends Component {
  constructor (props) {
    super(props)

    this.state = {
      signin: true,
      signup: false
    }
  }

  componentWillReceiveProps (props) {
    const formName = props.form

    this.setState({
      signin: formName === 'signup' || !formName,
      signup: formName === 'signin'
    })
  }

  render () {
    return (
      <div className='header-item'>
        {
          this.state.signup &&
           (
             <Link
               to='/signup'
               className='header-link anon-user'>
               {t('header.signup')}
             </Link>
           )
        }
        {
          this.state.signin &&
           (
             <Link
               to={{
                 pathname: '/signin',
                 query: window.location.pathname !== '/signup'
                   ? { ref: window.location.pathname }
                   : null
               }}
               className='header-link anon-user'>
               {t('header.signin')}
             </Link>
           )
        }
      </div>
    )
  }
}
