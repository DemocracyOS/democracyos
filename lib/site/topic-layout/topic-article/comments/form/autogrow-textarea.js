import React, { Component } from 'react'

export default class AutoGrowTextarea extends Component {
  componentDidMount () {
    this.recomputeSize()
  }

  componentDidUpdate () {
    this.recomputeSize()
  }

  handleChange = () => {
    this.recomputeSize()
  }

  recomputeSize = () => {
    const node = this.refs.textarea
    node.style.minHeight = 'auto'
    node.style.minHeight = `${node.scrollHeight}px`
  }

  render () {
    return (
      <textarea onChange={this.handleChange} {...this.props} ref='textarea' />
    )
  }
}
