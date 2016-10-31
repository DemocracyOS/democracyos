import React, {Component} from 'react'
import {findDOMNode} from 'react-dom'

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
    const node = findDOMNode(this)
    node.style.minHeight = 'auto'
    node.style.minHeight = `${node.scrollHeight}px`
  }

  render () {
    return (
      <textarea onChange={this.handleChange} {...this.props} />
    )
  }
}
