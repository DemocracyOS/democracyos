import React from 'react'
import Head from '../client/site/components/head'
import Router from 'next/router'
import Link from 'next/link'
import { NextAuth } from 'next-auth-client'

export default class extends React.Component {
  static async getInitialProps ({ req }) {
    return {
      session: await NextAuth.init({ req }),
      linkedAccounts: await NextAuth.linked({ req }),
      providers: await NextAuth.providers({ req })
    }
  }

  constructor (props) {
    super(props)
    this.state = {
      email: '',
      session: this.props.session
    }
    this.handleEmailChange = this.handleEmailChange.bind(this)
    this.handleSignInSubmit = this.handleSignInSubmit.bind(this)
  }

  handleEmailChange (event) {
    this.setState({
      email: event.target.value
    })
  }

  handleSignInSubmit (event) {
    event.preventDefault()

    if (!this.state.email) return

    NextAuth.signin(this.state.email)
      .then(() => {
        Router.push(`/auth/check-email?email=${this.state.email}`)
      })
      .catch(() => {
        Router.push(`/auth/error?action=signin&type=email&email=${this.state.email}`)
      })
  }

  render () {
    return (
      <div className='container'>
        <Head />
        <div className='text-center'>
          <h1>Welcome to DemocracyOS!</h1>
          <p>In a few steps, you can have your own instance running! But first, please sign in.</p>     
        </div>
        <div className='row'>
          <div className='col-sm-6 mr-auto ml-auto'>
            <div className='card mt-3 mb-3'>
              <div className='card-body pb-0'>
                <form id='signin' method='post' action='/auth/email/signin' onSubmit={this.handleSignInSubmit}>
                  <input name='_csrf' type='hidden' value={this.state.session.csrfToken}/>
                  <p>
                    <label htmlFor='email'>Email address:</label> <br />
                    <input name='email' type='text' placeholder='j.smith@example.com' id='email' className='form-control' value={this.state.email} onChange={this.handleEmailChange}/>
                  </p>
                  <p className='text-right'>
                    <button id='submitButton' type='submit' className='btn btn-outline-primary'>Sign in with email</button>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

