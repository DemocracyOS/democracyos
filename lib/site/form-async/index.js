import React, { Component } from 'react'
import t from 't-component'
import parse from 'form-parse'
import debug from 'debug'
import Request from 'lib/request/request'

let log = debug('democracyos:form-async')

export default class FormAsync extends Component {
  constructor (props) {
    super(props)
    this.state = {
      hidden: false
    }
  }

  componentWillReceiveProps (nextProps) {
    this.setState({ hidden: nextProps.hidden })
  }

  handleSubmit = (evt) => {
    evt.preventDefault()

    const form = evt.target

    // send form, attach callbacks
    const data = parse(form)

    Request
    .post(form.getAttribute('action'))
    .send(data)
    .end((err, res) => {
      if (err &&
        this.props.onFail &&
        typeof this.props.onFail === 'function') {
        log(err.response)
        try {
          if(err.response.body.error === 'A user with the given username is already registered') {
            return this.props.onFail([t('signup.user-already-registered')])
          }
        } catch (error) { log(error) }
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
      if (res.body &&
        res.body.error &&
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
