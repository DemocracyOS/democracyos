import React, { Component } from 'react'
import { Link } from 'react-router'
import t from 't-component'
import config from 'lib/config'

export default class NotFound extends Component {
  render () {
    return (
      <div id='content-404'>
        <div className='container-404'>
          <img src={config.logo} />
          <p className='note'>404</p>
          <h1 className='title'>
            {t('404.not-exists')}
          </h1>
          <p className='goback'>
            {t('404.go-back-to') + ' '}
            <Link
              title={t('404.back-to-democracyos')}
              to='/'>
              {config.organizationName}
            </Link>
          </p>
        </div>
      </div>
    )
  }
}
