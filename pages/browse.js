import React from 'react'
import Page from '../client/site/components/page'
import Head from '../client/site/components/head'
import Header from '../client/site/components/header'
import BrowseGrid from '../client/site/components/browse/browse-grid'

export default class extends Page {
  static async getInitialProps ({ req, query }) {
    let props = await super.getInitialProps({ req })
    props.query = query
    return props
  }

  render () {
    return (
      <div className='container'>
        <Head {...this.props} />
        <Header settings={this.props.settings} session={this.props.session} />
        <BrowseGrid query={this.props.query} />
      </div>
    )
  }
}
