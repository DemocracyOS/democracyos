import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

export default class Timeago extends PureComponent {
  static propTypes = {
    date: PropTypes.string
  }

  getDate = () => moment(this.props.date).fromNow()

  state = {
    timeago: this.getDate()
  }

  componentDidMount () {
    this.interval = setInterval(this.update, 1000 * 60)
  }

  componentWillUnmount () {
    clearInterval(this.interval)
  }

  update = () => {
    this.setState({
      timeago: this.getDate()
    })
  }

  render () {
    return (
      <span className='timeago'>{this.state.timeago}</span>
    )
  }
}
