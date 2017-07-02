import React, { Component } from 'react'
import { Link } from 'react-router'
import t from 't-component'
import Request from 'lib/request/request'
import FormAsync from 'lib/site/form-async'
import userConnector from 'lib/site/connectors/user'

class Resend extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false,
      errors: [],
      email: '',
      active: null
    }
  }

  componentWillMount () {
    if (this.props.route.path === 'validate/:token') {
      this.setState({ active: 'validating' })
      Request
      .post('/api/signup/validate')
      .send({ token: this.props.params.token })
      .end((err, res) => {
        if (err || res.body.error) {
          this.setState({ active: 'form', errors: [t('common.internal-error')] })
          return
        }
        this.setState({ active: 'welcome' })
        this.props.user.update(res.body)
      })
      return
    }
    this.setState({ active: 'form' })
  }

  handleOnSubmit = () => {
    this.setState({ loading: true })
  }

  handleOnSuccess = () => {
    this.setState({
      loading: false,
      active: 'check',
      errors: null
    })
  }

  handleOnFail = (err) => {
    this.setState({ loading: false, errors: err })
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
                  <i className='icon-envelope' />
                </div>
                <h1>{t('signup.resend-validation-email')}</h1>
              </div>

              <FormAsync
                action='/api/signup/resend-validation-email'
                onSuccess={this.handleOnSuccess}
                onFail={this.handleOnFail}
                onSubmit={this.handleOnSubmit}>

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
                  {!this.state.loading && (
                    <button
                      className='btn btn-success btn-block btn-lg'>
                      {t('signup.resend-email')}
                    </button>
                  )}
                  {this.state.loading && (
                    <button
                      className='loader-btn btn btn-block btn-default btn-lg'>
                      <div className='loader' />
                      {t('signup.resend-email')}
                    </button>
                  )}
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
              <p className='lead'>{t('signup.validation-email-resent')}</p>
              <p className='lead'>{t('signup.check-email')}</p>
            </div>
          )
        }
        {
          this.state.active === 'validating' &&
          (
            <div id='validating-message'>
              <div className='title-page'>
                <div className='circle'>
                  <span className='loader' />
                </div>
                <h1>{t('signup.validating')}</h1>
              </div>
            </div>
          )
        }
        {
          this.props.user.state.fulfilled &&
          this.state.active === 'welcome' &&
          (
            <div id='welcome-message'>
              <h1>
                { t('signup.welcome', { name: this.props.user.state.value.firstName }) }
              </h1>
              <p className='lead'>
                {t('signup.email-validated')}.
              </p>
              <p className='lead'>
                {t('signup.now-can-vote')}
              </p>
              <p className='lead'>
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

export default userConnector(Resend)
