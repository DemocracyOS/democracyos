import React, {Component} from 'react'
import {Link} from 'react-router'
import t from 't-component'

export default class CommentsOrderBy extends Component {
  constructor (props) {
    super(props)
    this.state = {
      sortsVisibility: false,
      active: 'createdAt'
    }
  }

  handleShowSorts = () => {
    this.setState({sortsVisibility: !this.state.sortsVisibility})
  }

  render () {
    const {
      onSelectSort
    } = this.props

    const sorts = [
      {id: 'score', label: t('comments.sorts.score')},
      {id: 'createdAt', label: t('comments.sorts.newest-first')},
      {id: '-createdAt', label: t('comments.sorts.oldest-first')}
    ]

    return (
      <div onClick={this.handleShowSorts}>
        <span>{t('comments.ordered-by')}</span>
        <ul>
          {
            this.state.sortsVisibility &&
            sorts.map((sort) => {
              return (
                <li
                  key={sort.id}
                  onClick={onSelectSort(sort.id)}>
                  {sort.label}
                </li>
              )
            })
          }
        </ul>
      </div>
    )
  }
}
