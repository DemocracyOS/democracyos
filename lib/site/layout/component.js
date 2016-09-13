import React, {Component} from 'react'
import Header from '../header/component'

export default class Layout extends Component {
  render () {
    return (
      <div id='outer-layout'>
        <Header />
        {this.props.children}
      </div>
    )
  }
}
