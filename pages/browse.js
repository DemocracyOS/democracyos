import React from 'react'
import Page from '../client/site/components/page'
import Head from '../client/site/components/head'
import Header from '../client/site/components/header'
import PostGrid from '../client/site/components/post-grid'

export default class extends Page {
  constructor (props) {
    super(props)
    this.state = {
      posts: []
    }
  }

  render () {
    return (
      <div className='container'>
        <Head {...this.props} />
        <Header settings={this.props.settings} user={this.props.session.user} />
        <PostGrid filter={true} />
      </div>
    )
  }
}
