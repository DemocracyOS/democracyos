import React from 'react'
import PropTypes from 'prop-types'

export const PublicProfile = ({ user }) => (
  <div className='public-profile-wrapper'>
    <div className='public-profile-container'>
      <h2>{user.name}</h2>
      <p className='public-profile-date'>Member since: {user.createdAt}</p>
      <p className='public-profile-bio'>{user.bio}</p>
    </div>
    <style jsx>{`
      .public-profile-wrapper {
        width: 740px;
        padding: 20px;
      }
      h2 {
        font-size: 33px;
      }
      .public-profile-date {
        font-size: 14px;
        color: rgba(0,0,0,0.5);
        margin-bottom: 20px;
      }
      .public-profile-bio {
        font-size: 20px;
        margin-top: 5px;
      }
      @media screen and (max-width: 767px) {
        .public-profile-wrapper: {
          padding: 0px;
          max-width: 640px;
        }
      }

    `}</style>
  </div>
)

PublicProfile.propTypes = {
  user: PropTypes.object.isRequired
}
