import React, {Component} from 'react'
import t from 't-component'

export default class SignIn extends Component {
  render () {
    return (
      <div className='signin-container inner-container small-container'>
        <div id='signin-form'>
          <div className='title-page'>
            <div className='circle'>
              <i className='icon-signin'></i>
            </div>
            <h1>{t('signin.login')}</h1>
          </div>
          <form
            role='form'
            method='post'
            action='/api/signin'
            className='form'>
            {/*autosubmit='autosubmit'*/}
            {/*autovalidate='autovalidate'*/}
            <ul className='form-errors'></ul>
            <div className='form-group'>
              <label htmlFor=''>{t('signup.email')}</label>
              <input
                type='text'
                className='form-control'
                name='email'
                placeholder={t('forgot.mail.example')}
                tabIndex={1} />
                {/*validate='required email'*/}
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
                tabIndex={2} />
                {/*validate='required'*/}
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
            <button className='btn btn-block btn-primary btn-lg' tabIndex={3}>
              {t('signin.login')}
            </button>
          </form>
        </div>
      </div>
    )
  }
}

