import React, { Component } from 'react'
import t from 't-component'

export default class BtnFacebook extends Component {
  static defaultProps = {
    action: '/auth/facebook'
  }

  render () {
    const { action } = this.props

    return (
      <form
        className='btn-facebook-form'
        action={action}
        method='get'
        role='form'>
        <button
          className='btn btn-block btn-facebook'
          type='submit'>
          <i className='icon-social-facebook' />
          {t('signin.login-with-facebook')}
        </button>
      </form>
    )
  }
}
