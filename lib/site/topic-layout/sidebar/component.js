import React, { Component } from 'react'
import bus from 'bus'
import Filter from './filter/component'
import List from './list/component'
import sorts from './sorts'

export default class Sidebar extends Component {
  constructor (props) {
    super(props)

    this.state = {
      topics: null,
      filterOpenCount: 0,
      filterClosedCount: 0,
      filterOpenCloseToggle: true,
      filterHideVoted: false,
      filterCurrentSort: 'closing-soon',
      showSidebar: false
    }
  }

  componentWillMount () {
    bus.on('sidebar:show', this.toggleSidebar)
    bus.emit('sidebar:enable', true)
  }

  componentWillUnmount () {
    bus.off('sidebar:show', this.toggleSidebar)
    bus.emit('sidebar:enable', false)
  }

  componentWillReceiveProps (props) {
    if (!props.topics) return

    const count = props.topics.length
    const filterOpenCount = props.topics.filter((topic) => !topic.closed).length
    const filterClosedCount = count - filterOpenCount

    this.setState({ filterOpenCount, filterClosedCount }, this.setFilter)
  }

  toggleSidebar = (bool) => {
    this.setState({ showSidebar: bool })
  }

  handleFilterStatusChange = (evt) => {
    const status = evt.currentTarget.getAttribute('data-status') === 'open'
    this.setFilter({ filterOpenCloseToggle: status })
  }

  handleFilterHideVotedChange = (evt) => {
    const hide = evt.currentTarget.checked
    this.setFilter({ filterHideVoted: hide })
  }

  handleFilterSortChange = (evt) => {
    const sort = evt.currentTarget.getAttribute('data-sort')
    this.setFilter({ filterCurrentSort: sort })
  }

  setFilter = (nextFilterState) => {
    if (!this.props.topics) return

    const state = Object.assign({}, this.state, nextFilterState)

    state.topics = this.props.topics
      // Status
      .filter((topic) => state.filterOpenCloseToggle ? !topic.closed : topic.closed)
      // Hide Voted
      .filter((topic) => state.filterHideVoted ? !topic.voted : true)
      // Sort
      .sort(sorts[state.filterCurrentSort].sort)

    this.setState(state)
  }

  render () {
    return (
      <nav id='sidebar' className={this.state.showSidebar && 'active'}>
        {
          this.props.topics !== null && (
            <Filter
              sorts={sorts}

              openCount={this.state.filterOpenCount}
              closedCount={this.state.filterClosedCount}
              openCloseToggle={this.state.filterOpenCloseToggle}
              hideVoted={this.state.filterHideVoted}
              currentSort={this.state.filterCurrentSort}

              onFilterStatusChange={this.handleFilterStatusChange}
              onFilterSortChange={this.handleFilterSortChange}
              onFilterHideVotedChange={this.handleFilterHideVotedChange} />
          )
        }
        {
          this.props.topics !== null && (
            <List
              topics={this.state.topics}
              activeTopic={this.props.activeTopic} />
          )
        }
      </nav>
    )
  }
}
