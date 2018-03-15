import React from 'react'
import Page from '../client/site/components/page'
import Head from '../client/site/components/head'
import Header from '../client/site/components/header'

export default class extends Page {
  render () {
    return (
      <div className='container'>
        <Head {...this.props} />
        <Header settings={this.props.settings} user={this.props.session.user} />
        <h1>Hi, i'm browse page</h1>
      </div>
    )
  }
}
