import React, { Component } from 'react'
import t from 't-component'
import ReactOutsideEvent from 'react-outside-event'

export class CommentsOrderBy extends Component {
  static sorts = [
    { id: '-score', label: t('comments.sorts.score') },
    { id: '-createdAt', label: t('comments.sorts.newest-first') },
    { id: 'createdAt', label: t('comments.sorts.oldest-first') }
  ]

  static getSortLabel (id) {
    const sort = CommentsOrderBy.sorts.find((s) => s.id === id)
    return sort ? sort.label : null
  }

  constructor (props) {
    super(props)

    this.state = {
      sortsVisibility: false,
      active: '-score'
    }
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
    const sorts = this.constructor.sorts
    const getSortLabel = this.constructor.getSortLabel

    return (
      <div className='comments-sort'>
        <button className='comments-sort-btn btn btn-link btn-sm' onClick={this.handleShowSorts}>
          {t('comments.ordered-by')}
          <strong>&nbsp;{getSortLabel(this.state.active)}</strong>
          <span className='caret'></span>
        </button>
        {
          this.state.sortsVisibility && (
            <div className='comments-dropdown'>
              {
                sorts.map((sort) => (
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
