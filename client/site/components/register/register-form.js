import React from 'react'
import PropTypes from 'prop-types'
import Router from 'next/router'
import { fetchWrapper } from '../../../utils/fetch-wrapper'

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

  handleSubmit = async (e) => {
    e.preventDefault()
    const url = `/api/v1.0/users/${this.props.id}`
    const options = {
      'method': 'PUT',
      'headers': {
        'Content-Type': 'application/json'
      },
      'body': {
        firstLogin: false,
        username: this.state.username,
        bio: this.state.bio,
        name: this.state.name
      }
    }
    try {
      await fetchWrapper(url, options)
      this.props.role === 'admin' ? Router.push('/init-settings') : Router.push('/')
    } catch (error) {
      this.setState({ error: true }, () => console.error(error))
    }
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
