import React, {Component} from 'react'
import { Link } from 'react-router'
import t from 't-component'
import User from 'lib/user/user'
import Request from 'lib/request/request'
import FormAsync from 'lib/site/form-async'

export default class Resend extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false,
      errors: [],
      email: '',
      active: null,
      userName: null
    }
    this.onSuccess = this.onSuccess.bind(this)
    this.onFail = this.onFail.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  componentWillMount () {
    if (this.props.route.path === '/signup/validate/:token') {
      this.setState({active: 'validating'})
      Request
      .post('/api/signup/validate')
      .send({token: this.props.params.token})
      .end((err, res) => {
        if (err || res.body.error) {
          this.setState({active: 'form', errors: [t('common.internal-error')]})
          console.log(err || res.body.error)
          return
        }
        console.log(res)
        User.set(res.body)
        this.setState({active: 'welcome', userName: res.body.firstName})
      })
      return
    }
    this.setState({active: 'form'})
  }

  onSubmit (data) {
    this.setState({loading: true})
  }

  onSuccess (res) {
    this.setState({
      loading: false,
      active: 'check',
      errors: null
    })
  }

  onFail (err) {
    this.setState({loading: false, errors: err})
  }

  render () {
    return (
      <div className='center-container'>
        {
          this.state.active === 'form' &&
          (
            <div id='resend-form'>
              <div className='title-page'>
                <div className='circle'>
                  <i className='icon-envelope'></i>
                </div>
                <h1>{t('signup.resend-validation-email')}</h1>
              </div>
              <FormAsync
                action='/api/signup/resend-validation-email'
                onSuccess={this.onSuccess.bind(this)}
                onFail={this.onFail.bind(this)}
                onSubmit={this.onSubmit.bind(this)}>
                <ul
                  className={this.state.errors.length ? 'form-errors' : 'hide'}>
                  {
                    this.state.errors && this.state.errors
                      .map((error, key) => (<li key={key}>{error}</li>))
                  }
                </ul>
                <div className='form-group'>
                  <label htmlFor='signup-email'>{t('signup.email')}</label>
                  <input
                    placeholder={t('forgot.mail.example')}
                    type='text'
                    name='email'
                    tabIndex={1}
                    className='form-control' />
                </div>
                <div className='form-group'>
                  <button
                    className={!this.state.loading ? 'btn btn-success btn-block btn-lg' : 'hide'}>
                    {t('signup.resend-email')}
                  </button>
                  <button
                    className={this.state.loading ? 'loader-btn btn btn-block btn-default btn-lg' : 'hide'}>
                    <div className='loader'></div>
                    {t('signup.resend-email')}
                  </button>
                </div>
              </FormAsync>
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
        }
        {
          this.state.active === 'check' &&
          (
            <div id='resend-message'>
              <h1>{t('signup.email-sent')}</h1>
              <p className='lead text-muted'>{t('signup.validation-email-resent')}</p>
              <p className='lead text-muted'>{t('signup.check-email')}</p>
            </div>
          )
        }
        {
          this.state.active === 'validating' &&
          (
            <div id='validating-message'>
              <div className='title-page'>
                <div className='circle'>
                  <span className='loader'></span>
                </div>
                <h1>{t('signup.validating')}</h1>
              </div>
            </div>
          )
        }
        {
          this.state.active === 'welcome' &&
          (
            <div id='welcome-message'>
                <h1>
                  { t('signup.welcome', { name: this.state.userName })}
                </h1>
                <p className='lead text-muted'>
                  {t('signup.email-validated')}.
                </p>
                <p className='lead text-muted'>
                {t('signup.now-can-vote')}
                </p>
                <p className='lead text-muted'>
                  {t('signup.go-to')}&nbsp;
                  <Link to='/'>
                    {t('signup.browsing')}
                  </Link>
                </p>
            </div>
          )
        }
      </div>
    )
  }
}
