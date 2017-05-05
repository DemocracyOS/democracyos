import React from 'react'

export default () => {
  const user = window.initialState.authFacebookConfirmUser

  return (
    <div className='container-simple ext-auth-facebook-confirm'>
      <p className='title'>Ingresar como:</p>
      <img className='avatar' src={user.avatar} alt={user.displayName} />
      <h3 className='name'>{user.displayName}</h3>
      <a
        href='/auth/facebook'
        className='confirm btn btn-block btn-success'>
        Ingresar
      </a>
    </div>
  )
}
