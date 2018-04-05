import React from 'react'
import PropTypes from 'prop-types'
import Router from 'next/router'
import { NextAuth } from 'next-auth-client'
import Head from '../client/site/components/head'

export default class Init extends React.Component {
  static async getInitialProps ({ req }) {
    return {
      session: await NextAuth.init({ req })
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
        <div className='row'>
          <div className='col-sm-6 mr-auto ml-auto'>
            <div className='card mt-5'>
              <div className='card-header text-center'>
                <h1 className='card-title'>Welcome to DemocracyOS!</h1>
                <p className='card-subtitle'>In a few steps, you can have your own instance running! But first, please sign in.</p>
              </div>
              <div className='card-body pb-0'>
                <form id='signin' method='post' action='/auth/email/signin' onSubmit={this.handleSignInSubmit}>
                  <input name='_csrf' type='hidden' value={this.state.session.csrfToken} />
                  <p>
                    <label htmlFor='email'>Email address:</label> <br />
                    <input name='email' type='text' placeholder='j.smith@example.com' id='email' className='form-control' value={this.state.email} onChange={this.handleEmailChange} />
                  </p>
                  <p className='text-right'>
                    <button id='submitButton' type='submit' className='btn btn-primary'>Sign in with email</button>
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

Init.propTypes = {
  session: PropTypes.object
}
