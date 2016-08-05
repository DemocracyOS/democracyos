import React, {Component} from 'react'
import t from 't-component'

export default class AnonUser extends Component {

  render () {
    return (
      <div>
        <a href='/signup' className='login anonymous-user'>
          <i className='icon-user'></i>
          <span>{t('header.signup')}</span>
        </a>
        <a href='/signin' className='login anonymous-user'>
          <i className='icon-signin'></i>
          <span>{t('header.signin')}</span>
        </a>
      </div>
    )
  }
}
