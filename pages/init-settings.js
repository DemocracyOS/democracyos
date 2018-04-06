import React from 'react'
import Router from 'next/router'
import Page from '../client/site/components/page'
import Head from '../client/site/components/head'
import Header from '../client/site/components/header'
import SettingsForm from '../client/site/components/settings/settings-form'

const Nav = () => (
  <header>
    <nav className='navbar mt-3'>
      <h1>Democracy OS</h1>
    </nav>
  </header>
)

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
          : <Nav />
        }
        {this.props.settings.error &&
          <div className='row'>
            <SettingsForm />
          </div>
        }
      </div>
    )
  }
}
