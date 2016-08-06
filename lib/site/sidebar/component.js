import React, {Component} from 'react'
import Filter from './filter/component.js'
import List from './list/component.js'

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
