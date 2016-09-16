import React, {Component} from 'react'
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
      <div>
        <Link
          to='/signup'
          className={this.state.signup ? 'login anonymous-user' : 'hide'}>
          <span>{t('header.signup')}</span>
        </Link>
        <Link
          to={
            {
              pathname: '/signin',
              query: window.location.pathname !== '/signup'
                ? { ref: window.location.pathname }
                : null
            }
          }
          className={this.state.signin ? 'login anonymous-user' : 'hide'}>
          <i className='icon-signin'></i>
          <span>{t('header.signin')}</span>
        </Link>
      </div>
    )
  }
}
