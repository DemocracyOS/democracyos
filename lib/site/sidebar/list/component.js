import React, {Component} from 'react'
import bus from 'bus'
import user from '../../../user/user'
import ListItem from './list-item/component'

export default class List extends Component {
  constructor (props) {
    super(props)
    this.state = {
      items: [],
      user: user
    }
    this.onListUpdate = this.onListUpdate.bind(this)
  }

  componentDidMount () {
    bus.on('topic-filter:update', this.onListUpdate)
  }

  componentWillUnmount () {
    bus.off('topic-filter:update', this.onListUpdate)
  }

  onListUpdate (items, filter) {
    this.setState({
      items: items
    })
  }

  render () {
    let userLogged = this.state.user.logged()
    return (
      <ul className='nav sidebar-list'>
        {
          this.state.items.map(function (item) {
            return <ListItem key={item.id} item={item} userLogged={userLogged} />
          })
        }
      </ul>
    )
  }
}
