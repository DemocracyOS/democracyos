import React, {Component} from 'react'
import t from 't-component'

export default class CommentsOrderBy extends Component {
  constructor (props) {
    super(props)

    this.state = {
      sortsVisibility: false,
      active: localStorage.getItem('comments-sort') || 'createdAt'
    }
  }

  handleShowSorts = () => {
    this.setState({sortsVisibility: !this.state.sortsVisibility})
  }

  handleSort = (id) => () => {
    this.props.onSort(id)
    localStorage.setItem('comments-sort', id)
  }

  render () {
    const sorts = [
      {id: 'score', label: t('comments.sorts.score')},
      {id: '-createdAt', label: t('comments.sorts.newest-first')},
      {id: 'createdAt', label: t('comments.sorts.oldest-first')}
    ]

    const getSortLabel = (id) => {
      const selectedSortKey = sorts.map((s) => s.id).indexOf(id)
      return sorts[selectedSortKey].label
    }
    return (
      <div
        onClick={this.handleShowSorts}
        className='comments-sort'>
        <span>
          {t('comments.ordered-by')}
          <strong>&nbsp;{getSortLabel(this.state.active)}</strong>
          <span className='caret'></span>
        </span>
        <ul>
          {
            this.state.sortsVisibility &&
            sorts.map((sort) => (
                <li
                  key={sort.id}
                  onClick={this.handleSort(sort.id)}>
                  {sort.label}
                </li>
              )
            )
          }
        </ul>
      </div>
    )
  }
}
