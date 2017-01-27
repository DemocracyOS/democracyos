import React, { Component } from 'react'
import ListItem from './list-item/component'

export default class List extends Component {
  render () {
    if (!this.props.topics) return null
    return (
      <ul className='nav sidebar-list'>
        {
          this.props.topics.map((item) => {
            return <ListItem
              key={item.id}
              item={item}
              active={
                !~window.location.pathname.indexOf('topic') &&
                this.props.activeTopic === item.id
              } />
          })
        }
      </ul>
    )
  }
}
