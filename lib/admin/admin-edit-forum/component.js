import React, { Component } from 'react'
import t from 't-component'
import forumStore from 'lib/stores/forum-store/forum-store'
import 'whatwg-fetch'

export default class EditForum extends Component {
  constructor (props) {
    super(props)
    this.state = {
      name: this.props.forum.name,
      title: this.props.forum.title,
      summary: this.props.forum.summary,
      coverUrl: this.props.forum.coverUrl,
      updated: false
    }
  }

  handleChange = (name) => (event) => {
    this.setState({
      [name]: event.target.value
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    forumStore
      .edit(this.props.forum.id, this.state)
      .then((result) => {
        this.setState({ updated: true })
        setTimeout(() => {
          if (result.results.forum.name !== this.props.forum.name) {
            window.location.pathname = `/${result.results.forum.name}/admin/edit-forum`
          }
          this.setState({ updated: false })
        }, 2000)
      })
      .catch(console.error)
  }

  render () {
    const { title, name, summary, coverUrl, updated } = this.state

    return (
      <article className='forum-edit-form col-xs-12 col-md-8 col-md-offset-2'>
        <div className='forum-top'>
          <h1 className='forum-title'>{t('forum.form.edit.title')}</h1>
        </div>
        <form
          role='form'
          noValidate='novalidate'
          className='form' >
          <div className='fieldsets'>
            <fieldset>
              <label>{t('forum.form.url.label')}</label>
              <div className='input-group subdomain'>
                <div className='input-group-addon'>
                  <span className='desktop'>http://localhost/</span>
                  <span className='mobile'>/</span>
                </div>
                <input
                  type='text'
                  autoCorrect='off'
                  autoCapitalize='off'
                  required
                  value={name}
                  onChange={this.handleChange('name')} />
                <span className='error name-unavailable hide'>La URL no está disponible</span>
              </div>
            </fieldset>
            <fieldset>
              <label>{t('forum.form.title.label')}</label>
              <div className='form-group clearfix title'>
                <input
                  type='text'
                  name='title'
                  placeholder={t('forum.form.title.placeholder')}
                  required
                  value={title}
                  onChange={this.handleChange('title')} />
              </div>
            </fieldset>
            <fieldset>
              <label>{t('forum.form.summary.label')}</label>
              <div className='form-group clearfix summary'>
                <input
                  type='text'
                  name='summary'
                  placeholder={t('forum.form.summary.placeholder')}
                  maxLength='300'
                  value={summary}
                  onChange={this.handleChange('summary')} />
              </div>
            </fieldset>
            <fieldset>
              <label>{t('forum.form.cover')}</label>
              <div className='form-group clearfix summary'>
                <input
                  type='text'
                  placeholder={t('admin-topics-form.placeholder.cover')}
                  value={coverUrl}
                  onChange={this.handleChange('coverUrl')} />
              </div>
            </fieldset>
          </div>
          {updated && <div className='alert alert-success'>
            {t('forum.form.edit.success')}
          </div>}
          <button
            className='btn btn-block btn-primary btn-lg'
            onClick={this.handleSubmit} >
            {t('forum.form.edit.submit')}
          </button>
        </form>
      </article>
    )
  }
}
