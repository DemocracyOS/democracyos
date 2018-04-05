import React from 'react'
import Page from '../client/site/components/page'
import Head from '../client/site/components/head'
import Header from '../client/site/components/header'
import RegisterForm from '../client/site/components/register/register-form'

export default class extends Page {
  render () {
    return (
      <div className='container'>
        <Head {...this.props} />
        {!this.props.settings.error ? 
          <Header settings={this.props.settings} user={this.props.session.user} />
          : <header className='text-center'>
            <h1>1/2 User register</h1>
          </header>
        }
        <RegisterForm
          id={this.props.session.user.id}
          settingsInit={!this.props.settings.error} />
      </div>
    )
  }
}
