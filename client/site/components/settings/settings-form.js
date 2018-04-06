import React from 'react'
import SettingsModal from './settings-modal'

export default class SettingsForm extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      'communityName': 'Default title',
      'mainColor': '#000000',
      'success': false,
      'error': false
    }
  }

  handleSubmit = (e) => {
    e.preventDefault()
    fetch('/api/v1.0/settings', {
      'method': 'POST',
      'headers': {
        'Content-Type': 'application/json'
      },
      'body': JSON.stringify({
        'communityName': this.state.communityName,
        'mainColor': this.state.mainColor
      })
    })
      .then((res) => res.json())
      .then((res) => {
        this.setState({
          success: true
        })
      })
      .catch((err) => {
        console.log(err)
        this.setState({
          error: true
        })
      })
  }

  handleChange = (e) => {
    const name = e.target.name
    const value = e.target.value
    this.setState({
      [name]: value
    })
  }

  handleSkip = (e) => {
    this.setState({
      communityName: 'Default title',
      mainColor: '#000000'
    }, () => this.handleSubmit(e))
  }

  render () {
    return (
      <form className='col-sm-6 offset-sm-3 mt-5 card' onSubmit={this.handleSubmit}>
        <h2 className='card-header'>Settings</h2>
        { this.state.success &&
          <SettingsModal />
        }
        { this.state.error &&
          <div className='alert alert-danger' role='alert'>
            An error ocurred, please try again later.
          </div>
        }
        <div className='card-body'>
          <div className='form-group'>
            <label htmlFor='communityName'>
              Community name:
            </label>
            <input
              type='text'
              name='communityName'
              className='form-control'
              value={this.state.communityName}
              onChange={this.handleChange} />
          </div>
          <div className='form-group'>
            <label htmlFor='mainColor'>
              Main color:
            </label>
            <input
              type='color'
              name='mainColor'
              value={this.state.mainColor}
              onChange={this.handleChange}
              className='color-input' />
          </div>
        </div>
        <div className='card-footer text-right'>
          <button className='btn btn-primary' type='submit'>
              Submit
          </button>
          <button className='btn btn-default ml-3' onClick={this.handleSubmit}>
            Skip
          </button>
        </div>
        <style jsx>{`
          .card {
            padding: 0;
          }
          .color-input {
            display: block;
            width: 100px;
          }
        `}</style>
      </form>
    )
  }
}
