import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import debounce from 'lodash.debounce'
import jump from 'jump.js'

export default class Anchor extends Component {
  constructor (props) {
    super(props)

    this.handleHashChange = debounce(this.handleHashChange, 200)
  }

  componentDidMount () {
    if (this.props.id) {
      this.removeHistoryListener = browserHistory.listen(this.handleHashChange)
    }
  }

  componentWillUnmount () {
    if (typeof this.removeHistoryListener === 'function') {
      this.removeHistoryListener()
    }
  }

  handleHashChange = ({ hash }) => {
    if (!hash) return
    const id = hash.slice(1)
    if (id === this.props.id) this.scroll()
  }

  scroll = () => {
    jump(this.el, {
      duration: 400
    })
  }

  render () {
    const props = this.props

    return (
      <div {...props} id={props.id} ref={(el) => { this.el = el }}>
        { props.children }
      </div>
    )
  }
}

Anchor.propTypes = {
  id: React.PropTypes.string
}
