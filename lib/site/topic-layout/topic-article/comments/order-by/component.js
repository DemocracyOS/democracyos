import React, { Component } from 'react'
import t from 't-component'
import ReactOutsideEvent from 'react-outside-event'

export class CommentsOrderBy extends Component {
  constructor (props) {
    super(props)

    this.state = {
      sortsVisibility: false,
      active: '-score'
    }

    this.sorts = [
      { id: '-score', label: t('comments.sorts.score') },
      { id: '-createdAt', label: t('comments.sorts.newest-first') },
      { id: 'createdAt', label: t('comments.sorts.oldest-first') }
    ]
  }

  getSortLabel = (id) => {
    const sort = this.sorts.find((s) => s.id === id)
    return sort ? sort.label : null
  }

  handleShowSorts = () => {
    this.setState({ sortsVisibility: !this.state.sortsVisibility })
  }

  handleSort = (id) => () => {
    this.props.onSort(id)

    this.setState({
      sortsVisibility: false,
      active: id
    })
  }

  onOutsideEvent = () => {
    if (!this.state.sortsVisibility) return
    this.setState({ sortsVisibility: false })
  }

  render () {
    return (
      <div className='comments-sort'>
        <button className='comments-sort-btn btn btn-link btn-sm' onClick={this.handleShowSorts}>
          {t('comments.ordered-by')}
          <strong>&nbsp;{this.getSortLabel(this.state.active)}</strong>
          <span className='caret'></span>
        </button>
        {
          this.state.sortsVisibility && (
            <div className='comments-dropdown'>
              {
                this.sorts.map((sort) => (
                  <button
                    type='button'
                    key={sort.id}
                    onClick={this.handleSort(sort.id)}>
                    {sort.label}
                  </button>
                ))
              }
            </div>
          )
        }
      </div>
    )
  }
}

export default ReactOutsideEvent(CommentsOrderBy)
