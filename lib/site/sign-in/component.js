import React, {Component} from 'react'
import FormAsync from 'lib/site/form-async'
import t from 't-component'
import bus from 'bus'
import User from 'lib/user/user'

export default class SignIn extends Component {
  componentWillMount () {
    bus.emit('user-form-load', 'signin')
  }

  componentWillUnmount () {
    bus.emit('user-form-load', '')
  }

  onSignInSubmit (e) {
    console.log('onSignInSubmit', e)
  }

  onSignInSuccess (res) {
    console.log('onSignInSuccess', res)
    if (res.body) User.set(res.body)
  }

  onSignInFail (err) {
    console.log('onSignInFail', err)
  }

  render () {
    return (
      <div className='signin-container inner-container small-container'>
        <div id='signin-form'>
          <div className='title-page'>
            <div className='circle'>
              <i className='icon-login'></i>
            </div>
            <h1>{t('signin.login')}</h1>
          </div>
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
              className='btn btn-block btn-primary btn-lg'
              tabIndex={3}
              type='submit'>
              {t('signin.login')}
            </button>
          </FormAsync>
        </div>
      </div>
    )
  }
}

