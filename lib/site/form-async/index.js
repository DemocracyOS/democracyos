import React, {Component} from 'react'
import Request from 'lib/request/request'
import t from 't-component'

export default class FormAsync extends Component {
  constructor (props) {
    super(props)
    this.state = {
      hidden: false
    }
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    this.setState({hidden: nextProps.hidden})
  }

  handleSubmit (e) {
    e.preventDefault()
    // validation
    if (e.target.querySelector('input[data-same-as]')) {
      let same = e.target.querySelector('input[data-same-as]')
      let sameTo = e.target.querySelector(same.getAttribute('data-same-as'))
      if (same && sameTo) {
        if (same.value !== sameTo.value) {
          same.setCustomValidity(t('common.pass-match-error'))
          return
        } else {
          same.setCustomValidity('')
        }
      } else {
        console.warn('FormAsync validate input same to.', same, sameTo)
      }
    }
    // send form, attach callbacks
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
      this.props.onSubmit(e)
    }
  }

  render () {
    return (
      <form
        onSubmit={this.handleSubmit}
        action={this.props.action}
        role='form'
        className={this.state.hidden && 'hide'}
        autoComplete={this.props.autoComplete === 'off' ? 'off' : 'on'}>
        {this.props.children}
      </form>
    )
  }
}
