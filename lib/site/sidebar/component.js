import React, {Component} from 'react'
import Filter from './filter/component'
import List from './list/component'

export default class Sidebar extends Component {
  render () {
    return (
      <nav id='sidebar'>
        <Filter />
        <List />
      </nav>
    )
  }
}
