import React, { Component } from 'react'
import 'whatwg-fetch'
import t from 't-component'
import urlBuilder from 'lib/url-builder'

export default class ExportUpdate extends Component {
  constructor (props) {
    super(props)
    this.state = {
      hasError: false,
      sucess: false,
      loading: false
    }
  }

  onLoadFile = (e) => {
    this.setState({ loading: true })
    const input = e.target
    const file = input.files[0]
    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target.result
      fetch(`/api/v2/topics.csv?forum=${this.props.forum.id}`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ csv: content })
      })
      .then((res) => {
        input.value = ''
        if (res.status !== 200) {
          this.setState({
            hasError: true,
            loading: false
          })
        } else {
          this.setState({
            success: true,
            loading: false
          })
        }
        setTimeout(() => this.setState({
          success: false,
          hasError: false
        }), 5000)
      })
      .catch(() => {
        input.value = ''
        this.setState({
          hasError: true,
          loading: false
        })
      })
    }
    reader.readAsText(file)
  }

  render () {
    const { forum } = this.props
    return (
      <div className='export-update'>
        {this.state.hasError && (
          <div className='error-message'>
            <p>{ t('modals.error.default') }</p>
          </div>
        )}
        {this.state.success && (
          <div className='success-message'>
            <p>{ t('admin-topics.update-from-csv.success') }</p>
          </div>
        )}
        <a
          href={urlBuilder.for('admin.topics.csv', { forum: forum.name })}
          className='btn btn-primary'>
          { t('admin-comments.dowload-as-csv') }
        </a>
        <label className='btn btn-primary label-file'>
          {this.state.loading ? t('form.please-wait') : t('admin-topics.update-from-csv') }
          <input type='file' id='input-file' accept='.csv' onChange={this.onLoadFile} ref='inputCsv' />
        </label>
      </div>
    )
  }
}
