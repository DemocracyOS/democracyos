import React from 'react'
import Page from '../client/site/components/page'
import Head from '../client/site/components/head'
import Header from '../client/site/components/header'
import { PrivateProfile } from '../client/site/components/profile/private-profile'
import { PublicProfile } from '../client/site/components/profile/public-profile'

export default class extends Page {
  static async getInitialProps ({ req, query }) {
    let props = await super.getInitialProps({ req })
    const userId = props.session.user ? (props.session.user.id).toString() : null
    props.id = query.id
    props.isOwner = userId === props.id
    return props
  }

  constructor (props) {
    super(props)
    this.state = {
      user: false,
      editMode: false
    }
  }

  async componentDidMount () {
    fetch(`/api/v1.0/users/${this.props.id}`, {
      credentials: 'include'
    })
      .then((res) => res.json())
      .then((res) => {
        this.setState({ user: res })
      })
      .catch((err) => console.log(err))
  }

  handleEditMode = () => {
    this.setState({
      editMode: !this.state.editMode
    })
  }

  render () {
    return (
      <div className='container'>
        <Head {...this.props} />
        <Header settings={this.props.settings} session={this.props.session} />
        {!(!this.state.user) &&
          <div className='profile-wrapper'>
            {this.state.editMode ? (
              <PrivateProfile
                user={this.state.user}
                handleEditMode={this.handleEditMode} />
            ) : (
              <PublicProfile
                user={this.state.user}
                isOwner={this.props.isOwner}
                handleEditMode={this.handleEditMode} />
            )}
          </div>
        }
        <style jsx>{`
          .profile-wrapper {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
          }
        `}</style>
      </div>
    )
  }
}
