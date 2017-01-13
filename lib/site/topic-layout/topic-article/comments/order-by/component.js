import React, {Component} from 'react'
import t from 't-component'

export default class CommentsOrderBy extends Component {
  static sorts = [
    {id: '-score', label: t('comments.sorts.score')},
    {id: '-createdAt', label: t('comments.sorts.newest-first')},
    {id: 'createdAt', label: t('comments.sorts.oldest-first')}
  ]

  static getSortLabel (id) {
    const sort = CommentsOrderBy.sorts.find((s) => s.id === id)
    return sort ? sort.label : null
  }

  constructor (props) {
    super(props)

    this.state = {
      sortsVisibility: false,
      active: localStorage.getItem('comments-sort') || '-score'
    }
  }

  handleShowSorts = () => {
    this.setState({sortsVisibility: !this.state.sortsVisibility})
  }

  handleSort = (id) => () => {
    this.props.onSort(id)
    this.setState({active: id})
    localStorage.setItem('comments-sort', id)
  }

  render () {
    const sorts = this.constructor.sorts
    const getSortLabel = this.constructor.getSortLabel

    return (
      <div
        onClick={this.handleShowSorts}
        className='comments-sort'>
        <span>
          {t('comments.ordered-by')}
          <strong>&nbsp;{getSortLabel(this.state.active)}</strong>
          <span className='caret'></span>
        </span>
        {
          this.state.sortsVisibility && (
            <ul>
              {
                sorts.map((sort) => (
                  <li
                    key={sort.id}
                    onClick={this.handleSort(sort.id)}>
                    {sort.label}
                  </li>
                ))
              }
            </ul>
          )
        }
      </div>
    )
  }
}
