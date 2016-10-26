import React, {Component} from 'react'
import {Link} from 'react-router'
import t from 't-component'
import config from 'lib/config'

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
      <div>
        {
          this.state.signup &&
           (
             <Link
               to='/signup'
               className='login anonymous-user'>
               <span>{t('header.signup')}</span>
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
                   ? {ref: window.location.pathname}
                   : null
               }}
               className='login anonymous-user'>
               <i className='icon-signin' />
               <span>{t('header.signin')}</span>
             </Link>
           )
        }
      </div>
    )
  }
}
