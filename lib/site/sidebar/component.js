import React, {Component} from 'react'
import Filter from './filter/component'
import List from './list/component'
import sorts from 'lib/site/topic-filter/sorts'

export default class Sidebar extends Component {
  constructor (props) {
    super(props)
    this.state = {
      topics: null,
      filter: {
        openCloseToggle: true,
        openCount: 0,
        closedCount: 0,
        currentSort: 'closing-soon'
      }
    }
  }

  componentWillReceiveProps (props) {
    this.setState({topics: props.topics})
  }

  render () {
    return (
      <aside className='nav-proposal'>
        <nav id='sidebar'>
          <Filter
            openCloseToggle={this.state.filter.openCloseToggle}
            openCount={this.state.filter.openCount}
            closedCount={this.state.filter.closedCount}
            currentSort={this.state.filter.currentSort}
            sorts={sorts} />
          <List topics={this.state.topics} />
        </nav>
      </aside>
    )
  }
}
