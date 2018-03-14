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
        <Header settings={this.props.settings} user={this.props.session.user} />
        <RegisterForm id={this.props.session.user.id} />
      </div>
    )
  }
}
