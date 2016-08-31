import React, {Component} from 'react'
import t from 't-component'
import FormAsync from 'lib/site/form-async'

export default class Reset extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false,
      errors: null,
      email: ''
    }
    this.onSuccess = this.onSuccess.bind(this)
    this.onFail = this.onFail.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit (data) {
    this.setState({loading: true})
  }

  onSuccess (res) {
    console.log('reset success', res)
    this.setState({loading: false, errors: ['Reenvio exitoso']})
  }

  onFail (err) {
    this.setState({loading: false, errors: err})
  }

  render () {
    return (
      <div className='form-container'>
        <div id='reset-form'>
          <div className="title-page">
            <div className="circle">
              <i className="icon-signin"></i>
            </div>
            <h1>{t('forgot.reset')}</h1>
          </div>
          <FormAsync
            action="/api/forgot/reset"
            className="form"
            onSuccess={this.onSuccess.bind(this)}
            onFail={this.onFail.bind(this)}
            onSubmit={this.onSubmit.bind(this)}>
            <input
              type="hidden"
              name='token'
              defaultValue={this.props.token} />
            <div className="form-group">
              <label htmlFor="pass-reset">{t('password.new')}</label>
              <input
                type="text"
                className="form-control"
                type='password'
                name='password'
                tabIndex={1}
                placeholder={t('password')}
                pattern='.{6,}'
                required />
            </div>
            <div className="form-group">
              <label htmlFor="pass-reset-re">{t('password.retype')}</label>
              <input
                type="text"
                className="form-control"
                type='password'
                name='re_password'
                tabIndex={2}
                placeholder={t('password.repeat')}
                required />
            </div>
            <div className="form-group">
              <button
                className={!this.state.loading ? 'btn btn-primary' : 'hide'}
                type='submit'
                tabIndex={3}>
                {t('form.send')}
              </button>
              <button
                className={this.state.loading ? 'loader-btn btn btn-default' : 'hide'}>
                <div className='loader'></div>
                {t('form.send')}
              </button>
            </div>
          </FormAsync>
        </div>
      </div>
    )
  }
}

