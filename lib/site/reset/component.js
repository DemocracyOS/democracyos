import React, { Component } from 'react'
import t from 't-component'
import FormAsync from 'lib/site/form-async'

export default class Reset extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false,
      errors: [],
      msg: '',
      email: ''
    }
    this.onSuccess = this.onSuccess.bind(this)
    this.onFail = this.onFail.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit (data) {
    this.setState({ loading: true })
  }

  onSuccess (res) {
    this.setState({ loading: false, errors: [], msg: t('settings.password-updated') })
  }

  onFail (err) {
    this.setState({ loading: false, errors: err })
  }

  validatePass (e) {
    const inputs = e.target.parentNode.parentNode.getElementsByTagName('input')
    const pass = inputs[1]
    if (pass.value.length < 6) {
    const rePass = inputs[2]
      pass.setCustomValidity(t('validators.min-length.plural', { n: 6 }))
      pass.checkValidity()
    } else {
      if (pass.value !== rePass.value) {
        rePass.setCustomValidity(t('common.pass-match-error'))
        pass.checkValidity()
      } else {
        rePass.setCustomValidity('')
        pass.setCustomValidity('')
        pass.checkValidity()
      }
    }
  }

  render () {
    return (
      <div className='center-container'>
        <div id='reset-form'>
          <div className='title-page'>
            <div className='circle'>
              <i className='icon-energy' />
            </div>
            <h1>{t('forgot.reset')}</h1>
          </div>
          <FormAsync
            action='/api/forgot/reset'
            className='form'
            onSuccess={this.onSuccess.bind(this)}
            onFail={this.onFail.bind(this)}
            onSubmit={this.onSubmit.bind(this)}>
            <input
              type='hidden'
              name='token'
              defaultValue={this.props.params.token} />
            {
              !!this.state.errors.length &&
              (
                <ul
                  className='form-errors'>
                  {
                    this.state.errors && this.state.errors
                      .map((error, key) => (<li key={key}>{error}</li>))
                  }
                </ul>
              )
            }
            {
              !!this.state.msg &&
              (
                <div className='alert alert-success'>
                  {this.state.msg}
                </div>
              )
            }
            <div className='form-group'>
              <label htmlFor='pass-reset'>{t('password.new')}</label>
              <input
                id='reset-pass'
                type='password'
                className='form-control'
                name='password'
                tabIndex={1}
                placeholder={t('password')}
                required />
            </div>
            <div className='form-group'>
              <label htmlFor='pass-reset-re'>{t('password.retype')}</label>
              <input
                type='password'
                className='form-control'
                name='re_password'
                tabIndex={2}
                placeholder={t('password.repeat')}
                required />
            </div>
            <div className='form-group'>
              <button
                className={!this.state.loading ? 'btn btn-primary btn-block' : 'hide'}
                onClick={this.validatePass}
                type='submit'
                tabIndex={3}>
                {t('form.send')}
              </button>
              <button
                className={this.state.loading ? 'loader-btn btn btn-default btn-block' : 'hide'}>
                <div className='loader' />
                {t('form.send')}
              </button>
            </div>
          </FormAsync>
        </div>
      </div>
    )
  }
}
