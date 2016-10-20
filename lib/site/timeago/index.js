import React, {Component} from 'react'
import moment from 'moment'

export default class Timeago extends Component {
  constructor (props) {
    super(props)

    this.state = {
      timeago: moment(this.props.date).fromNow()
    }
  }

  static propTypes = {
    date: React.PropTypes.string
  }

  componentWillMount () {
    this.interval = setInterval(this.update, 1000 * 60)
  }

  componentWillUnmount () {
    clearInterval(this.interval)
  }

  update = () => {
    this.setState({
      timeago: moment(this.props.date).fromNow()
    })
  }

  render () {
    return (
      <span className='timeago'>{this.state.timeago}</span>
    )
  }
}
