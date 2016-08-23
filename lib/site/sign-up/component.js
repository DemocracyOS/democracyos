import React, {Component} from 'react'
import t from 't-component'
import config from 'lib/config/config'

export default class SignUp extends Component {
  render () {
    const hasTos = !!config.termsOfService
    const hasPp = !!config.privacyPolicy
    let tos = null
    if (hasTos) {
      tos = (
        <li>
          <a
            href='/help/terms-of-service'
            target='_blank'>
            {t('help.tos.title')}
          </a>
        </li>
      )
    }
    let pp = null
    if (hasPp) {
      pp = (
        <li>
          <a
            href='/help/privacy-policy'
            target='_blank'>
            {t('help.pp.title')}
          </a>
        </li>
      )
    }
    let helpLinks = null
    if (hasPp || hasTos) {
      helpLinks = (
        <p className='help-block text-center'>
          {t('signup.accepting')}
          <ul className='text-center'>
            {tos}
            {pp}
          </ul>
        </p>
      )
    }
    let reference = null
    return (
      <div className='signup-container inner-container small-container'>
        <div id='signup-form'>
          <div className='title-page'>
            <div className='circle'>
              <i className='icon-user'></i>
            </div>
            <h1>{t('signup.with-email')}</h1>
          </div>
          <form
            className='form'
            action='/api/signup'
            method='post'
            role='form'>
            {/*autovalidate='autovalidate'*/}
            {/*autosubmit='autosubmit'*/}
            {reference && <input type='hidden' name='reference' value={reference} />}
            <ul className='form-errors'></ul>
            <div className='form-group'>
              <label htmlFor=''>{t('signup.email')}</label>
              <input
                type='email'
                className='form-control'
                name='email'
                tabindex={1}
                placeholder={t('forgot.mail.example')} />
                {/*validate='required email'*/}
            </div>
            <div className='form-group'>
              <label htmlFor=''>{t('signup.your-firstname')}</label>
              <input
                type='text'
                className='form-control'
                id='firstName'
                name='firstName'
                tabindex={2}
                placeholder={t('signup.firstname')} />
                {/*validate='required firstname'*/}
            </div>
            <div className='form-group'>
              <label htmlFor=''>{t('signup.your-lastname')}</label>
              <input
                type='text'
                className='form-control'
                id='lastName'
                name='lastName'
                tabindex={3}
                placeholder={t('signup.lastname')} />
                {/*validate='required lastname'*/}
            </div>
            <div className='form-group'>
              <label htmlFor=''>{t('password')}</label>
              <input
                className='form-control'
                type='password'
                name='password'
                tabindex={4}
                placeholder={t('password')} />
                {/*validate='required min-length:6'*/}
            </div>
            <div className='form-group'>
              <label htmlFor=''>{t('signup.retype-password')}</label>
              <input
                type='password'
                className='form-control'
                name='re_password'
                tabindex={5}
                placeholder={t('password.repeat')} />
                {/*validate='required same:password'*/}
            </div>
            <div className='form-group'>
              <button className='btn btn-success btn-block btn-lg' tabindex={6}>
                {t('signup.now')}
              </button>
            </div>
            <div className='form-group'>
              {helpLinks}
            </div>
          </form>
        </div>
        <div id='signup-message' className='hide'>
          <h1>Welcome</h1>
          <p className='lead text-muted'>{t('signup.received')}.</p>
          <p className='lead text-muted'>{t('signup.check-email')}</p>
          <a
            href='/signup/resend-validation-email'>
            {t('signup.resend-validation-email')}
          </a>
        </div>
      </div>

    )
  }
}

