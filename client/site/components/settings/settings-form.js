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
        console.log('hola')
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

  render () {
    return (
      <section className='row settings-form-wrapper'>
        <form className='settings-form' onSubmit={this.handleSubmit}>
          <div className='form-group'>
            <h4>Settings</h4>
          </div>
          { this.state.success &&
            <SettingsModal />
          }
          { this.state.error && 
            <div className='alert alert-danger' role='alert'>
              An error ocurred, please try again.
            </div>
          }
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
              onChange={this.handleChange} />
          </div>
          <div className='button-container'>
            <button className='btn btn-primary' type='submit'>
              Submit
            </button>
          </div>
        </form>
        <style jsx>{`
          .settings-form-wrapper {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
          }
          .button-container {
            display: flex;
            justify-content: center;
          }
          label {
            display: block;
          }
        `}</style>
      </section>
    )
  }
}