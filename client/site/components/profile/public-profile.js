import React from 'react'
import PropTypes from 'prop-types'

export const PublicProfile = ({ user }) => (
  <div className='public-profile-container'>
    <p>Soy un perfil publico</p>
  </div>
)

PublicProfile.propTypes = {
  user: PropTypes.object.isRequired
}
