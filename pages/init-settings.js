import React from 'react'
import Router from 'next/router'
import Page from '../client/site/components/page'
import Head from '../client/site/components/head'
import Header from '../client/site/components/header'
import SettingsForm from '../client/site/components/settings/settings-form'

export default class extends Page {
  componentDidMount () {
    // Redirects to admin if settings is already defined
    if (!this.props.settings.error) {
      Router.push({
        pathname: '/admin'
      })
    }
  }
  render () {
    return (
      <div className='container'>
        <Head />
        {!this.props.settings.error 
          ? <Header settings={this.props.settings} user={this.props.session.user} />
          : <header className='text-center'>
            <h1>2/2 Settings init</h1>
          </header>
        }
        {this.props.settings.error &&
          <SettingsForm />
        }
      </div>
    )
  }
}
