import React, {Component} from 'react'
import bus from 'bus'
import t from 't-component'
import config from 'lib/config/config'
import FormAsync from 'lib/site/form-async'
import Resend from './resend/component'

export default class SignUp extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false,
      active: null,
      errors: null,
      name: '',
      lastName: '',
      email: ''
    }
    this.onSuccess = this.onSuccess.bind(this)
    this.onFail = this.onFail.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.saveName = this.saveName.bind(this)
    this.saveLastName = this.saveLastName.bind(this)
    this.saveEmail = this.saveEmail.bind(this)
    this.resendValidationEmail = this.resendValidationEmail.bind(this)
  }

  componentWillMount () {
    bus.emit('user-form-load', 'signup')
    this.setState({active: 'form'})
  }

  componentWillUnmount () {
    bus.emit('user-form-load', '')
  }

  onSubmit (data) {
    this.setState({loading: true, errors: null})
  }

  onSuccess (res) {
    this.setState({
      loading: false,
      active: 'congrats',
      errors: null
    })
  }

  onFail (err) {
    this.setState({loading: false, errors: err})
  }

  saveName (e) {
    this.setState({name: e.target.value})
  }

  saveLastName (e) {
    this.setState({lastName: e.target.value})
  }

  saveEmail (e) {
    this.setState({email: e.target.value})
  }

  resendValidationEmail (e) {
    e.preventDefault()
    this.setState({active: 'resend'})
  }

  render () {
    return (
      <div className='form-container'>
        {
          this.state.active === 'form' &&
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
                onSubmit={this.onSubmit}
                onSuccess={this.onSuccess}
                onFail={this.onFail}>
                <input type='hidden' name='reference' value={this.props.location.query.ref} />
                <ul
                  className={this.state.errors ? 'form-errors' : 'hide'}>
                  {
                    this.state.errors && this.state.errors
                      .map((error, key) => (<li key={key}>{error}</li>))
                  }
                </ul>
                <div className='form-group'>
                  <label htmlFor=''>{t('signup.email')}</label>
                  <input
                    type='email'
                    className='form-control'
                    name='email'
                    tabIndex={1}
                    onChange={this.saveEmail}
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
                    id='signup-pass'
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
                    data-same-as='#signup-pass'
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
                  {
                    (!!config.termsOfService || !!config.privacyPolicy) &&
                    (
                      <p className='help-block text-center'>
                        {t('signup.accepting')}
                        <ul className='text-center'>
                          {
                            config.termsOfService &&
                            (
                              <li>
                                <a
                                  href='/help/terms-of-service'
                                  target='_blank'>
                                  {t('help.tos.title')}
                                </a>
                              </li>
                            )
                          }
                          {
                            !!config.privacyPolicy &&
                            (
                              <li>
                                <a
                                  href='/help/privacy-policy'
                                  target='_blank'>
                                  {t('help.pp.title')}
                                </a>
                              </li>
                            )
                          }
                        </ul>
                      </p>
                    )
                  }
                </div>
              </FormAsync>
            </div>
          )
        }
        {
          this.state.active === 'congrats' &&
          (
            <div id='signup-message'>
              <h1>{t('signup.welcome', {name: this.state.name + ' ' + this.state.lastName})}</h1>
              <p className='lead text-muted'>{t('signup.received')}.</p>
              <p className='lead text-muted'>{t('signup.check-email')}</p>
              <a
                onClick={this.resendValidationEmail}
                href='/signup/resend-validation-email'>
                {t('signup.resend-validation-email')}
              </a>
            </div>
          )
        }

        {
          this.state.active === 'resend' &&
          (
            <Resend email={this.state.email} />
          )
        }
      </div>
    )
  }
}

