import React from 'react'

export default class Home extends React.Component {
  render () {
    return <p>Hello, {this.props.name}</p>
  }
}

Home.propTypes = {
  name: React.PropTypes.string.isRequired
}
