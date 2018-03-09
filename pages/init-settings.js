import React from 'react'
import Router from 'next/router'
import Page from '../client/site/components/page'
import Head from '../client/site/components/head'
import Header from '../client/site/components/header'
import SettingsForm from '../client/site/components/settings/settings-form'

export default class extends Page {
  componentDidMount () {
    // Redirects to admin if settings is already defined
    if (this.props.settings) {
      Router.push({
        pathname: '/admin'
      })
    }
  }
  render () {
    return (
      <div className='container'>
        <Head {...this.props} />
        <Header settings={this.props.settings} user={this.props.session.user} />
        {!this.props.settings &&
          <SettingsForm />
        }
      </div>
    )
  }
}
