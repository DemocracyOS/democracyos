import React, {Component} from 'react'
import { browserHistory } from 'react-router'
import bus from 'bus'
import t from 't-component'
import config from 'lib/config/config'
import User from 'lib/user/user'
import FormAsync from 'lib/site/form-async'

export default class SignUp extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false
    }
    this.onSignUpSuccess = this.onSignUpSuccess.bind(this)
    this.onSignUpSubmit = this.onSignUpSubmit.bind(this)
    this.onSignUpFail = this.onSignUpFail.bind(this)
  }

  componentWillMount () {
    bus.emit('user-form-load', 'signup')
  }

  componentWillUnmount () {
    bus.emit('user-form-load', '')
  }

  onSignUpSubmit (data) {
    console.log('onSignUpSubmit ')
    this.setState({loading: true})
  }

  onSignUpSuccess (res) {
    console.log('onSignUpSuccess')
    this.setState({loading: false})
    if (res.body) User.set(res.body)
    if (this.props.location.query.ref) {
      var url = window.decodeURI(this.props.location.query.ref)
      console.log(url)
      browserHistory.push(url === '/signup' || !url ? '/' : url)
    }
  }

  onSignUpFail (err) {
    this.setState({loading: false})
    console.log('onSignUpFail', err)
  }

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
    return (
      <div id='signup-container'>
        <div id='signup-form'>
          <div className='title-page'>
            <div className='circle'>
              <i className='icon-user'></i>
            </div>
            <h1>{t('signup.with-email')}</h1>
          </div>
          <FormAsync
            action='/api/signup'
            onSubmit={this.onSignUpSubmit}
            onSuccess={this.onSignUpSuccess}
            onFail={this.onSignUpFail}>
            <input type='hidden' name='reference' value={this.props.location.query.ref} />
            <ul className='form-errors'></ul>
            <div className='form-group'>
              <label htmlFor=''>{t('signup.email')}</label>
              <input
                type='email'
                className='form-control'
                name='email'
                tabIndex={1}
                placeholder={t('forgot.mail.example')}
                required />
            </div>
            <div className='form-group'>
              <label htmlFor=''>{t('signup.your-firstname')}</label>
              <input
                type='text'
                className='form-control'
                id='firstName'
                name='firstName'
                tabIndex={2}
                placeholder={t('signup.firstname')}
                required />
            </div>
            <div className='form-group'>
              <label htmlFor=''>{t('signup.your-lastname')}</label>
              <input
                type='text'
                className='form-control'
                id='lastName'
                name='lastName'
                tabIndex={3}
                placeholder={t('signup.lastname')}
                required />
            </div>
            <div className='form-group'>
              <label htmlFor=''>{t('password')}</label>
              <input
                className='form-control'
                type='password'
                name='password'
                tabIndex={4}
                pattern='.{6,}'
                placeholder={t('password')} 
                required />
            </div>
            <div className='form-group'>
              <label htmlFor=''>{t('signup.retype-password')}</label>
              <input
                type='password'
                className='form-control'
                name='re_password'
                tabIndex={5}
                pattern='.{6,}'
                required />
            </div>
            <div className='form-group'>
              <button className='btn btn-success btn-block btn-lg' tabIndex={6}>
                {t('signup.now')}
              </button>
            </div>
            <div className='form-group'>
              {helpLinks}
            </div>
          </FormAsync>
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

