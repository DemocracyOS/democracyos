import React, { Component } from 'react'
import SignupComplete from '../../site/signup-complete/component'


export default class CompleteUserData extends Component {
  constructor (props) {
    super (props) 

  }

  componentWillMount() {
    // window.addEventListener('hashchange', () => {
    //   console.log(location.hash)
    // }) 
  }

  render() {

    return (
      <div className='modal-container'>
        <a className='close-modal' onClick={this.props.toggleUserModal}>X</a>
        <div className='form-component-wrapper'>
          <SignupComplete
          toggleUserModal={this.props.toggleUserModal} />
        </div>  
      </div>
    )
  }
}