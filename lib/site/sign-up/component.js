import React, {Component} from 'react'
import { Link } from 'react-router'
import bus from 'bus'
import t from 't-component'
import config from 'lib/config/config'
import FormAsync from 'lib/site/form-async'

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

  render () {
    return (
      <div className='center-container'>
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
                onFail={this.onFail}
                autoComplete='off'>
                <input
                  type='hidden'
                  name='reference'
                  value={this.props.location.query.ref} />
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
                    onChange={this.saveLastName}
                    placeholder={t('signup.lastname')}
                    required />
                </div>
                <div className='form-group'>
                  <label htmlFor=''>{t('password')}</label>
                  <input
                    id='signup-pass'
                    className='form-control'
                    name='password'
                    type='password'
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
                    pattern='.{6,}'
                    required />
                </div>
                <div className='form-group'>
                  <button
                    className={!this.state.loading ? 'btn btn-block btn-success btn-lg' : 'hide'}
                    type='submit'>
                    {t('signup.now')}
                  </button>
                  <button
                    className={this.state.loading ? 'loader-btn btn btn-block btn-default btn-lg' : 'hide'}>
                    <div className='loader'></div>
                    {t('signup.now')}
                  </button>
                </div>
                  {
                    (!!config.termsOfService || !!config.privacyPolicy) &&
                    (
                      <div className='form-group accepting'>
                        <p className='help-block text-center'>
                          {t('signup.accepting')}
                        </p>
                        {
                          !!config.termsOfService &&
                          (
                            <Link
                              to='/help/terms-of-service'>
                              {t('help.tos.title')}
                            </Link>
                          )
                        }
                        {
                          !!config.privacyPolicy &&
                          (
                            <Link
                              to='/help/privacy-policy'>
                              {t('help.pp.title')}
                            </Link>
                          )
                        }
                      </div>
                    )
                  }
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
              <Link
                to='/signup/resend-validation-email'>
                {t('signup.resend-validation-email')}
              </Link>
            </div>
          )
        }
      </div>
    )
  }
}
