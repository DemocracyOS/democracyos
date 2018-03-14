import React from 'react'
import Page from '../client/site/components/page'
import Head from '../client/site/components/head'
import Header from '../client/site/components/header'
import { PrivateProfile } from '../client/site/components/profile/private-profile'
import { PublicProfile } from '../client/site/components/profile/public-profile'

export default class extends Page {
  static async getInitialProps ({ req }) {
    let props = await super.getInitialProps({ req })
    const userId = (props.session.user.id).toString()
    console.log(req.url.query)
    props.isOwner = userId === props.id
    return props
  }

  constructor (props) {
    super(props)
    this.state = {
      user: false
    }
  }

  async componentDidMount () {
    fetch(`/api/v1.0/users/${this.props.id}`)
      .then((res) => res.json())
      .then((res) => {
        this.setState({ user: res })
      })
      .catch((err) => console.log(err))
  }

  render () {
    return (
      <div className='container'>
        <Head {...this.props} />
        <Header settings={this.props.settings} user={this.props.session.user} />
        {!(!this.state.user) &&
          <div className='profile-wrapper'>
            {this.props.isOwner ? (
              <PrivateProfile user={this.state.user} />
            ) : (
              <PublicProfile user={this.state.user} />
            )}
          </div>
        }
      </div>
    )
  }
}
