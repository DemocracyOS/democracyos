import React, {Component} from 'react'
import t from 't-component'
import parse from 'form-parse'
import Request from 'lib/request/request'

export default class FormAsync extends Component {
  constructor (props) {
    super(props)
    this.state = {
      hidden: false
    }
  }

  componentWillReceiveProps (nextProps) {
    this.setState({hidden: nextProps.hidden})
  }

  handleSubmit = (evt) => {
    evt.preventDefault()

    const form = evt.target

    // validation
    const same = form.querySelector('input[data-same-as]')
    if (same) {
      const sameTo = form.querySelector(same.getAttribute('data-same-as'))

      if (same && sameTo) {
        if (same.value !== sameTo.value) {
          same.setCustomValidity(t('common.pass-match-error'))
          return
        }
        same.setCustomValidity('')
      } else {
        console.warn('FormAsync validate input same to.', same, sameTo)
      }
    }

    // send form, attach callbacks
    const data = parse(form)

    Request
    .post(form.getAttribute('action'))
    .send(data)
    .end((err, res) => {
      if (err &&
        this.props.onFail &&
        typeof this.props.onFail === 'function') {
        console.warn(err.response)
        let message = ''
        switch (err.response.status) {
          case 401:
            message = t('common.auth-error')
            break
          default:
            message = t('common.internal-error')
        }
        return this.props.onFail([message])
      }

      if (res.body.error &&
        this.props.onFail &&
        typeof this.props.onFail === 'function') {
        if (res.body.error && res.body.code) {
          return this.props.onFail([res.body.error], res.body.code)
        }
        return this.props.onFail([res.body.error])
      }

      if (this.props.onSuccess && typeof this.props.onSuccess === 'function') {
        this.props.onSuccess(res.body)
      }
    })

    if (this.props.onSubmit && typeof this.props.onSubmit === 'function') {
      this.props.onSubmit(evt)
    }
  }

  render () {
    return (
      <form
        onSubmit={this.handleSubmit}
        action={this.props.action}
        role='form'
        className={this.state.hidden ? 'hide' : null}>
        {this.props.children}
      </form>
    )
  }
}
