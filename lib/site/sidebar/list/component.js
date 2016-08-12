import React, {Component} from 'react'
import user from 'lib/user/user'
import ListItem from './list-item/component'



export default class List extends Component {
  render () {
    if (!this.props.topics) return null
    let userLogged = user.logged()
    return (
      <ul className='nav sidebar-list'>
        {
          this.props.topics.map(function (item) {
            return <ListItem key={item.id} item={item} userLogged={userLogged} />
          })
        }
      </ul>
    )
  }
}
