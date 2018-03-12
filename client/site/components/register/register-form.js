import React from 'react'
import PropTypes from 'prop-types'
import Router from 'next/router'

export default class RegisterForm extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      fistLogin: false,
      username: '',
      bio: '',
      error: false
    }
  }

  handleInputChange = (e) => {
    const name = e.target.name
    const value = e.target.value
    this.setState({ [name]: value })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const body = {
      firstLogin: this.state.fistLogin,
      username: this.state.username,
      bio: this.state.bio
    }
    fetch(`/api/v1.0/users/${this.props.id}`, {
      'method': 'PUT',
      'headers': {
        'Content-Type': 'application/json'
      },
      'body': JSON.stringify(body)
    })
      .then((res) => res.json())
      .then((res) => {
        Router.push('/')
      })
      .catch((err) => {
        console.log(err)
        this.setState({ error: true })
      })
  }

  render () {
    return (
      <section className='row register-form-wrapper'>
        <form className='col-md-6' onSubmit={this.handleSubmit}>
          <div className='form-group'>
            <h2>User register</h2>
          </div>
          {this.state.error &&
            <div className='alert alert-danger' role='alert'>
              An error ocurred. Please try again.
            </div>
          }
          <div className='form-group'>
            <input type='hidden'
              className='form-control'
              name='firstLogin'
              defaultValue={this.state.fistLogin} />
          </div>
          <div className='form-group'>
            <label htmlFor='username'>Username:</label>
            <input type='text'
              className='form-control'
              placeholder='Username'
              name='username'
              value={this.state.username}
              onChange={this.handleInputChange} />
          </div>
          <div className='form-group'>
            <label htmlFor='bio'>Bio:</label>
            <textarea className='form-control'
              rows='5'
              placeholder='Bio'
              name='bio'
              value={this.state.bio}
              onChange={this.handleInputChange} />
          </div>
          <div className='form-group text-center'>
            <button type='submit' className='btn btn-primary'>
              Submit
            </button>
          </div>
        </form>
        <style jsx>{`
          .register-form-wrapper {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
          }
        `}</style>
      </section>
    )
  }
}

RegisterForm.propTypes = {
  id: PropTypes.string.isRequired
}
