import React from 'react'
import Page from '../client/site/components/page'
import Head from '../client/site/components/head'
import Header from '../client/site/components/header'
import RegisterForm from '../client/site/components/register/register-form'

const Nav = () => (
  <header>
    <nav className='navbar mt-3'>
      <h1>Democracy OS</h1>
    </nav>
  </header>
)

export default class extends Page {
  render () {
    return (
      <div className='container'>
        <Head {...this.props} />
        {!this.props.settings.error
          ? <Header settings={this.props.settings} user={this.props.session.user} />
          : <Nav />
        }
        <div className='row'>
          <RegisterForm
            role={this.props.session.user.role}
            id={this.props.session.user.id} />
        </div>
      </div>
    )
  }
}
