import React, {Component} from 'react'
import t from 't-component'
import bus from 'bus'
import user from '../../../user/user'

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
    console.log('onListUpdate', filter)
    this.setState({
      items: items
    })
  }

  createdBy () {
    if (item.participants.length > 0) {
      var cardinality = 1 === item.participants.length ? 'singular' : 'plural'
      return item.participants.length + ' ' + t('proposal-article.participant.' + cardinality)
      
    }
    if (item.closingAt) {
      var closed = item.closingAt && +new Date(item.closingAt) < Date.now()
      return (
        <span>
          <br/>
          <span className="time-ago-label">{(closed ? t('common.closed') : t('common.close'))}</span>
          <span data-time={item.closingAt.toString()} className="meta-item meta-timeago ago"></span>
        </span>
      )
    }
  }

  render () {
    var voted = this.state.user.logged() && !!item.voted
    return (
      <ul className="nav sidebar-list">
        {
          this.state.items.map((item) => {
            <li data-id={item.id} key={item.id} className={active ? 'active' : ''}>
              <a href={item.url} className={voted ? 'voted' : ''}>
                <div className="item-tag">
                  <img src={tagImages[item.tag.image].url} />
                  <img src='/tags-images/hexagon.svg' />
                </div>
                <div className="item-badges">
                  {
                    ((voted) ? <img src='/boot/check.png' /> : null)
                  }
                </div>
                <span className="title">
                  {item.mediaTitle}
                </span>
                <span className="created-by">
                  {createdBy()}
                </span>
              </a>
            </li>
          })
        }
      </ul>
    )
  }
}
