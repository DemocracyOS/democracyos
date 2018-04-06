import React from 'react'
import Link from 'next/link'
import Page from '../../client/site/components/page'
import Head from '../../client/site/components/head'

export default class extends Page {
  static async getInitialProps ({ query }) {
    return {
      email: query.email
    }
  }

  render () {
    return (
      <div className='container'>
        <Head />
        <div className='text-center'>
          <h1 className='display-4 mt-5 mb-3'>Check your email</h1>
          <p className='lead'>
            A sign in link has been sent to { (this.props.email) ? <span className='font-weight-bold'>{this.props.email}</span> : <span>your inbox</span> }.
          </p>
          <p>
            <Link href='/'><a className='text-primary'>Home</a></Link>
          </p>
        </div>
      </div>
    )
  }
}
