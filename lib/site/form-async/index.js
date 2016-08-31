import React, {Component} from 'react'
import Request from 'lib/request/request'

export default class FormAsync extends Component {
  constructor (props) {
    super(props)
    this.state = {
      hidden: false
    }
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({hidden: nextProps.hidden})
  }

  handleSubmit (e) {
    e.preventDefault()
    const form = e.target
    let data = {}
    let formData = new window.FormData(form)
    for (var pair of formData.entries()) {
      data[pair[0]] = pair[1]
    }
    Request
    .post(form.getAttribute('action'))
    .send(data)
    .end((err, res) => {
      if (err) return console.warn('FormAsync Request Error:', err)
      if (res.body.error &&
        this.props.onFail &&
        typeof this.props.onFail === 'function') {
        return this.props.onFail([res.body.error])
      }
      if (this.props.onSuccess && typeof this.props.onSuccess === 'function') {
        this.props.onSuccess(res.body)
      }
    })
    if (this.props.onSubmit && typeof this.props.onSubmit === 'function') {
      this.props.onSubmit(e)
    }
  }

  render () {
    return (
      <form
        onSubmit={this.handleSubmit}
        action={this.props.action}
        role='form'
        className={this.state.hidden && 'hide'}>
        {this.props.children}
      </form>
    )
  }
}
