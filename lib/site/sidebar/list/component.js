import React, {Component} from 'react'
import ListItem from './list-item/component'

export default class List extends Component {
  render () {
    if (!this.props.topics) return null
    return (
      <ul className='nav sidebar-list'>
        {
          this.props.topics.map(function (item) {
            return <ListItem key={item.id} item={item} />
          })
        }
      </ul>
    )
  }
}
