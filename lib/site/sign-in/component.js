import React, {Component} from 'react'
import { browserHistory } from 'react-router'
import t from 't-component'
import bus from 'bus'
import FormAsync from 'lib/site/form-async'
import User from 'lib/user/user'
import config from 'lib/config/config'

export default class SignIn extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false
    }
    this.onSignInSuccess = this.onSignInSuccess.bind(this)
    this.onSignInSubmit = this.onSignInSubmit.bind(this)
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

  onSignInSuccess (res) {
    this.setState({loading: false})
    if (res.body) User.set(res.body)
    if (this.props.location.query.ref) {
      var url = window.decodeURI(this.props.location.query.ref)
      browserHistory.push(url)
    }
  }

  onSignInFail (err) {
    this.setState({loading: false})
    console.log('onSignInFail', err)
  }

  render () {
    let form = (
      <FormAsync
        action='/api/signin'
        onSubmit={this.onSignInSubmit}
        onSuccess={this.onSignInSuccess}
        onFail={this.onSignInFail}>
        <ul className='form-errors'></ul>
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
            <a href='/forgot' tabIndex={4}>{t('forgot.question')}</a>
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
            <a
              href='/signup'
              tabIndex={5}>
              {t('signin.action.signup')}
            </a>
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
      <div id='signin-container'>
        <div id='signin-form'>
          <div className='title-page'>
            <div className='circle'>
              <i className='icon-login'></i>
            </div>
            <h1>{t('signin.login')}</h1>
          </div>
          {form}
        </div>
      </div>
    )
  }
}
