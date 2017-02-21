import React, { Component } from 'react'
import t from 't-component'
import 'whatwg-fetch'
import urlBuilder from 'lib/url-builder'

export default class AdminComments extends Component {
  constructor (props) {
    super(props)
    this.state = {
      filter: 'less-replies',
      comments: [],
      error: ''
    }
  }

  componentDidMount () {
    this.fetchComments()
  }

  fetchComments () {
    fetch('/api/v2/admin-comments?forum=' + this.props.forum.name, {
        method: 'GET',
        credentials: 'same-origin'
        // headers: {
        //   Accept: 'application/json',
        //   'Content-Type': 'application/json'
        // }
      })
      .then(res => res.ok && res.json())
      .then(comments => {
        if (!comments) return console.log('no comments')
        this.setState({comments, error: ''})
      })
      .catch(err => {
        console.error(err)
        this.setState({error: 'fetch comments error'})
      })
  }

  handleOnFilterChange = (e) => {
    this.setState({filter: e.target.value}, this.fetchComments)
  }

  render() {
    const { forum } = this.props
    return (
      <div className="comments-admin">
        <div className="well well-sm">
          <div className="comments-filters">
            { t('admin-comments.filter-by') } &nbsp;
            <select
              onChange={this.handleOnFilterChange}
              value={this.state.filter}>
              <option value="less-replies">{ t('admin-comments.filter-by.less-replies') }</option>
              <option value="more-flags">{ t('admin-comments.filter-by.more-flags') }</option>
            </select>
          </div>
          <a
            href={urlBuilder.for('admin.comments.csv', {forum: forum.name})}
            className="btn btn-primary pull-right">
            { t('admin-comments.dowload-as-csv') }
          </a>
        </div>
        <div className="row">
          {
            this.state.error && <div className="col-md-12">{ this.state.error }</div>
          }
          <div className="col-md-5">
            {
              this.state.comments.map(comment => {
                return <div>{comment.id}</div>
              })
            }
          </div>
        </div>
      </div>
    )
  }
}
