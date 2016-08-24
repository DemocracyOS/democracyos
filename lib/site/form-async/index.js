import React, {Component} from 'react'
import Request from 'lib/request/request'

export default class FormAsync extends Component {
  constructor (props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
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
      if (err) {
        if (this.props.onFail && typeof this.props.onFail === 'function') {
          this.props.onFail(err)
          return
        }
      }
      if (this.props.onSuccess && typeof this.props.onSuccess === 'function') {
        this.props.onSuccess(res)
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
        role='form'>
        {this.props.children}
      </form>
    )
  }
}
