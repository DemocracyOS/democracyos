import React from 'react'
import PropTypes from 'prop-types'

export class PrivateProfile extends React.Component {
  constructor (props) {
    super (props)
    this.state = {
      bio: '',
      name: '',
      username: ''
    }
  }

  componentDidMount () {
    this.setState({
      bio: this.props.user.bio,
      name: this.props.user.name,
      username: this.props.user.username
    })
  }

  render () {
    return (
      <section className='private-profile-container'>
        {console.log(this.props.user)}
        <p>Soy un perfil privado</p>
      </section>
    )
  }
}

PrivateProfile.propTypes = {
  user: PropTypes.object.isRequired
}
