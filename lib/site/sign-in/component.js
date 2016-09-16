import React, {Component} from 'react'
import t from 't-component'
import bus from 'bus'
import FormAsync from 'lib/site/form-async'
import User from 'lib/user/user'
import config from 'lib/config/config'
import { Link, browserHistory } from 'react-router'

export default class SignIn extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false,
      errors: null,
      showResend: null
    }
    this.onSignInSuccess = this.onSignInSuccess.bind(this)
    this.onSignInSubmit = this.onSignInSubmit.bind(this)
    this.onSignInFail = this.onSignInFail.bind(this)
  }

  componentWillMount () {
    bus.emit('user-form-load', 'signin')
  }

  componentWillUnmount () {
    bus.emit('user-form-load', '')
  }

  onSignInSubmit (data) {
    this.setState({loading: true})
  }

  onSignInSuccess (user) {
    this.setState({loading: false, errors: null})
    User.set(user)
    if (this.props.location.query.ref) {
      var url = window.decodeURI(this.props.location.query.ref)
      browserHistory.push(url === '/signup' ? '/' : url)
    } else {
      browserHistory.push('/')
    }
  }

  onSignInFail (err, code) {
    if (code && code === 'EMAIL_NOT_VALIDATED') {
      this.setState({loading: false, errors: err, showResend: true})
    } else {
      this.setState({loading: false, errors: err})
    }
  }

  render () {
    let form = (
      <FormAsync
        action='/api/signin'
        onSubmit={this.onSignInSubmit}
        onSuccess={this.onSignInSuccess}
        onFail={this.onSignInFail}>
        <ul
          className={this.state.errors ? 'form-errors' : 'hide'}>
          {
            this.state.errors && this.state.errors
              .map((error, key) => (<li key={key}>{error}</li>))
          }
        </ul>
        {
          this.state.showResend && (
            <div className='form-group resend-validation-email'>
              <a href='/signup/resend-validation-email'>{t('signup.resend-validation-email')}</a>
            </div>
          )
        }
        <div className='form-group'>
          <label htmlFor=''>{t('signup.email')}</label>
          <input
            type='email'
            className='form-control'
            name='email'
            placeholder={t('forgot.mail.example')}
            tabIndex={1}
            required />
        </div>
        <div className='form-group'>
          <div className='forgot'>
            <Link
              to='/forgot'
              tabIndex={4}>
              {t('forgot.question')}
            </Link>
          </div>
          <label htmlFor=''>{t('password')}</label>
          <input
            type='password'
            className='form-control'
            name='password'
            placeholder={t('password')}
            tabIndex={2}
            required />
        </div>
        <div className='form-group'>
          <div className='signup'>
            <span>{t('signin.dont-have-account')}</span>
            <Link
              to='/signup'
              tabIndex={5}>
              {t('signin.action.signup')}
            </Link>
          </div>
        </div>
        <div className='form-group'>
        </div>
        <button
          className={!this.state.loading ? 'btn btn-block btn-primary btn-lg' : 'hide'}
          tabIndex={3}
          type='submit'>
          {t('signin.login')}
        </button>
        <button
          className={this.state.loading ? 'loader-btn btn btn-block btn-default btn-lg' : 'hide'}>
          <div className='loader'></div>
          {t('signin.login')}
        </button>
      </FormAsync>
    )

    if (config.facebookSignin) {
      form = (
        <form
          action='/auth/facebook'
          method='get'
          role='form'
          className='facebook-auth-form'>
          <button
            className='btn-facebook'
            type='submit'>
            <span className='flaticon social facebook'>
              {t('signin.login-with-facebook')}
            </span>
          </button>
        </form>
      )
    }
    return (
      <div className='center-container' id='sign-in'>
        <div className='title-page'>
          <div className='circle'>
            <i className='icon-login'></i>
          </div>
          <h1>{t('signin.login')}</h1>
        </div>
        {form}
      </div>
    )
  }
}
