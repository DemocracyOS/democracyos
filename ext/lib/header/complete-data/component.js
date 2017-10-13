import React, { Component } from 'react'
import SignupComplete from '../../site/signup-complete/component'


export default class CompleteUserData extends Component {
  constructor (props) {
    super (props) 
  }

  render() {

    return (
      <div className='modal-wrapper'>
        <div className='overlay'></div>
        <div className='modal-dialog'>
          <a className='close-modal' onClick={this.props.toggleUserModal}>X</a>
          <div className='form-component-wrapper'>
            <SignupComplete
            toggleUserModal={this.props.toggleUserModal} />
          </div>  
        </div>
      </div>
    )
  }
}