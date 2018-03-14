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

  handleInputChange = (e) => {
    const name = e.target.name
    const value = e.target.value
    this.setState({
      [name]: value
    })
  }

  render () {
    return (
      <section className='row private-profile-container'>
        <form className='col-md-6'>
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
            <input className='form-control' type='text' name='name' value={this.state.name}  onChange={this.handleInputChange} />
          </div>
          <div className='form-group'>
            <label htmlFor='bio'>
              Bio
            </label>
            <textarea className='form-control' name='bio' rows='5' value={this.state.bio}  onChange={this.handleInputChange} />
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
