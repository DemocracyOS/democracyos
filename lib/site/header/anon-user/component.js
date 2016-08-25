import React, {Component} from 'react'
import { Link, browserHistory } from 'react-router'
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

  onSignIn (e) {
    browserHistory.push('/signin?ref=' + window.encodeURIComponent(window.location.pathname))
    e.preventDefault()
  }

  render () {
    return (
      <div>
        <Link
          to='/signup'
          className={this.state.signup ? 'login anonymous-user' : 'hide'}>
          <i className='icon-user'></i>
          <span>{t('header.signup')}</span>
        </Link>
        <a
          href='#'
          onClick={this.onSignIn}
          className={this.state.signin ? 'login anonymous-user' : 'hide'}>
          <i className='icon-signin'></i>
          <span>{t('header.signin')}</span>
        </a>
      </div>
    )
  }
}
