import React, {Component} from 'react'
import { browserHistory } from 'react-router'
import bus from 'bus'
import t from 't-component'
import config from 'lib/config/config'
import FormAsync from 'lib/site/form-async'

export default class SignUp extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false,
      congrats: false,
      error: null,
      name: '',
      lastName: ''
    }
    this.onSignUpSuccess = this.onSignUpSuccess.bind(this)
    this.onSignUpSubmit = this.onSignUpSubmit.bind(this)
    this.onSignUpFail = this.onSignUpFail.bind(this)
    this.saveName = this.saveName.bind(this)
    this.saveLastName = this.saveLastName.bind(this) 
  }

  componentWillMount () {
    bus.emit('user-form-load', 'signup')
  }

  componentWillUnmount () {
    bus.emit('user-form-load', '')
  }

  onSignUpSubmit (data) {
    this.setState({loading: true})
  }

  onSignUpSuccess (res) {
    console.log(res)
    if (res.body.error) {
      this.setState({loading: false, error: res.body.error})
    } else {
      this.setState({loading: false, congrats: true})
    }
  }

  saveName (e) {
    this.setState({name: e.target.value})
  }

  saveLastName (e) {
    this.setState({lastName: e.target.value})
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
    let validationComplete = (
      <div className='resend-container inner-container small-container'>
        <div id='resend-form'>
          <div className='title-page'>
            <div className='circle'>
              <i className='icon-user'></i>
            </div>
            <h1>{t('signup.resend-validation-email')}</h1>
          </div>
          <form
            action='/api/signup/resend-validation-email'
            className='form'>
            <ul className='form-errors'></ul>
            <div className='form-group'>
              <label htmlFor='signup-email'>{t('signup.email')}</label>
              <input
                placeholder={t('forgot.mail.example')}
                type='text'
                name='email'
                tabindex={1}
                className='form-control'/>
            </div>
            <div className='form-group'>
              <button className='btn btn-success btn-block btn-lg'>
                {t('signup.resend-email')}
              </button>
            </div>
          </form>
        </div>
        <div id='resend-message' className='hide'>
          <h1>{t('signup.email-sent')}</h1>
          <p className='lead text-muted'>
            {t('signup.validation-email-resent')}
          </p>
          <p className='lead text-muted'>
            {t('signup.check-email')}
          </p>
        </div>
      </div>
    )
    return (
      <div id='signup-container'>
        {
          !this.state.congrats &&
          (
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
                <ul className='form-errors'>
                  {this.state.error}
                </ul>
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
                    onChange={this.saveName}
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
                    onChange={this.saveLastName}
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
                  <button
                    className={!this.state.loading ? 'btn btn-block btn-success btn-lg' : 'hide'}
                    tabIndex={3}
                    type='submit'>
                    {t('signup.now')}
                  </button>
                  <button
                    className={this.state.loading ? 'loader-btn btn btn-block btn-default btn-lg' : 'hide'}>
                    <div className='loader'></div>
                    {t('signup.now')}
                  </button>
                </div>
                <div className='form-group'>
                  {helpLinks}
                </div>
              </FormAsync>
            </div>
          )
        }
        {
          this.state.congrats &&
          (
            <div id='signup-message'>
              <h1>{t('signup.welcome', {name: this.state.name + ' ' + this.state.lastName})}</h1>
              <p className='lead text-muted'>{t('signup.received')}.</p>
              <p className='lead text-muted'>{t('signup.check-email')}</p>
              <a
                href='/signup/resend-validation-email'>
                {t('signup.resend-validation-email')}
              </a>
            </div>
          )
        }
      </div>
    )
  }
}

