import React from 'react'
import PropTypes from 'prop-types'
import Router from 'next/router'

export default class RegisterForm extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      username: '',
      bio: '',
      name: '',
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
      firstLogin: false,
      username: this.state.username,
      bio: this.state.bio,
      name: this.state.name
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
        this.props.role === 'admin' ? Router.push('/init-settings') : Router.push('/')
      })
      .catch((err) => {
        this.setState({ error: true }, () => console.err(err))
      })
  }

  render () {
    return (
      <form className='col-sm-6 offset-sm-3 mt-1 card' onSubmit={this.handleSubmit}>
        <h2 className='card-header'>User register</h2>
        <div className='card-body'>
          {this.state.error &&
          <div className='alert alert-danger' role='alert'>
            An error ocurred. Please try again.
          </div>
          }
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
            <label htmlFor='name'>Name:</label>
            <input type='text'
              className='form-control'
              placeholder='Name'
              name='name'
              value={this.state.name}
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
        </div>
        <div className='card-footer text-right'>
          <button type='submit' className='btn btn-primary'>
              Submit
          </button>
          <button className='btn btn-default ml-3' onClick={() => Router.push('/init-settings')}>
              Skip
          </button>
        </div>
        <style jsx>{`
          .card {
            padding: 0;
          }
        `}</style>
      </form>
    )
  }
}

RegisterForm.propTypes = {
  id: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired
}
