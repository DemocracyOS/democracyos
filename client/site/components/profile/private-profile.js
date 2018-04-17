import React from 'react'
import PropTypes from 'prop-types'

export class PrivateProfile extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      bio: '',
      name: '',
      username: '',
      success: false,
      error: false
    }
  }

  componentDidMount () {
    this.setState({
      bio: this.props.user.bio,
      name: this.props.user.name,
      username: this.props.user.username
    })
  }

  handleInputChange = (e) => {
    const name = e.target.name
    const value = e.target.value
    this.setState({
      [name]: value
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const url = `/api/v1.0/users/${this.props.user._id}`
    const session = JSON.parse(localStorage.getItem('session'))
    console.log(session)
    const csrf = session.csrfToken
    const body = {
      bio: this.state.bio,
      name: this.state.name,
      username: this.state.username,
      _csrf: csrf
    }
    fetch(url, {
      'headers': {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      method: 'PUT',
      body: JSON.stringify(body)
    })
      .then((res) => res.json())
      .then((res) => {
        this.setState({ success: true })
        setTimeout(() => this.setState({
          success: false
        }), 5000)
      })
      .catch((err) => {
        console.error(err)
        this.setState({ error: true })
      })
  }

  render () {
    return (
      <section className='private-profile-container'>
        <form onSubmit={this.handleSubmit}>
          {this.state.success &&
            <div className='alert alert-success'>
              Changes have been successfully applied.
            </div>
          }
          {this.state.error &&
            <div className='alert alert-danger'>
              An error occurred. Please, try again.
            </div>
          }
          <div className='form-group'>
            <h2>My account</h2>
          </div>
          <div className='form-group'>
            <label htmlFor='username'>
              Username
            </label>
            <input className='form-control' type='text' name='username' value={this.state.username} onChange={this.handleInputChange} />
          </div>
          <div className='form-group'>
            <label htmlFor='name'>
              Name
            </label>
            <input className='form-control' type='text' name='name' value={this.state.name} onChange={this.handleInputChange} />
          </div>
          <div className='form-group'>
            <label htmlFor='bio'>
              Bio
            </label>
            <textarea className='form-control' name='bio' rows='5' value={this.state.bio} onChange={this.handleInputChange} />
          </div>
          <div className='form-group'>
            <label htmlFor='email'>
              Email
            </label>
            <input className='form-control' type='email' name='email' value={this.props.user.email} disabled readOnly />
          </div>
          <div className='form-group text-center'>
            <button className='btn btn-primary' type='submit'>
              Apply changes
            </button>
          </div>
        </form>
        <style jsx>{`
          .private-profile-container {
            display: flex;
            justify-content: center;
          }
          form {
            width: 640px;
          }
          input:disabled {
            cursor: not-allowed;
          }
        `}</style>
      </section>
    )
  }
}

PrivateProfile.propTypes = {
  user: PropTypes.object.isRequired
}
