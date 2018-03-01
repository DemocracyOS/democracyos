import React from 'react'
import Page from '../client/site/components/page'
import Head from '../client/site/components/head'
import Header from '../client/site/components/header'

export default class extends Page {
  constructor (props) {
    super(props)
    this.state = {
      post: null
    }
  }

  async componentDidMount () {
    const post = await fetch(`/api/v1.0/posts/${this.props.url.query.id}`)
    console.log(post)
  }

  render () {
    return (
      <div className='container'>
        <Head {...this.props} />
        <Header settings={this.props.settings} user={this.props.session.user} />
        {console.log(this.state.post)}
        <p>
          Hola, soy posts.
        </p>
      </div>
    )
  }
}
