import React, {Component} from 'react'
import {Link, browserHistory} from 'react-router'
import t from 't-component'
import bus from 'bus'
import config from 'lib/config'
import FormAsync from 'lib/site/form-async'
import userConnector from 'lib/site/connectors/user'

class SignIn extends Component {
  constructor (props) {
    super(props)

    this.state = {
      loading: false,
      errors: null,
      showResend: null
    }
  }

  componentWillMount () {
    bus.emit('user-form:load', 'signin')
  }

  componentWillUnmount () {
    bus.emit('user-form:load', '')
  }

  handleSubmit = () => {
    this.setState({loading: true})
  }

  handleSuccess = (attrs) => {
    this.setState({loading: false, errors: null})

    this.props.user.update(attrs)

    if (this.props.location.query.ref) {
      var url = window.decodeURI(this.props.location.query.ref)
      browserHistory.push(url === '/signup' ? '/' : url)
    } else {
      browserHistory.push('/')
    }
  }

  handleFail = (err, code) => {
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
        onSubmit={this.handleSubmit}
        onSuccess={this.handleSuccess}
        onFail={this.handleFail}>
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
              <Link to='/signup/resend-validation-email'>
                {t('signup.resend-validation-email')}
              </Link>
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
        <div className='form-group' />
        {!this.state.loading && (
          <button
            className='btn btn-block btn-primary btn-lg'
            tabIndex={3}
            type='submit'>
            {t('signin.login')}
          </button>
        )}
        {this.state.loading && (
          <button
            className='loader-btn btn btn-block btn-default btn-lg'>
            <div className='loader' />
            {t('signin.login')}
          </button>
        )}
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
            <i className='icon-login' />
          </div>
          <h1>{t('signin.login')}</h1>
        </div>
        {form}
      </div>
    )
  }
}

export default userConnector(SignIn)
