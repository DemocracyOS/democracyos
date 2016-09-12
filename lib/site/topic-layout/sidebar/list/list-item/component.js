import React, {Component} from 'react'
import user from 'lib/user/user'
import t from 't-component'
import tagImages from 'lib/tags-images'
import { Link } from 'react-router'

export default class ListItem extends Component {
  constructor (props) {
    super(props)
    this.onUserStateChange = this.onUserStateChange.bind(this)
  }

  componentWillMount () {
    user.on('loaded', this.onUserStateChange)
    user.on('unloaded', this.onUserStateChange)
  }

  componentWillUnmount () {
    user.off('loaded', this.onUserStateChange)
    user.off('unloaded', this.onUserStateChange)
  }

  onUserStateChange () {
    this.forceUpdate()
  }

  createdBy (item) {
    if (item.participants.length > 0) {
      var cardinality = item.participants.length === 1 ? 'singular' : 'plural'
      return item.participants.length + ' ' + t('proposal-article.participant.' + cardinality)
    }
    if (item.closingAt) {
      var closed = item.closingAt && +new Date(item.closingAt) < Date.now()
      return (
        <span>
          <br />
          <span className='time-ago-label'>{(closed ? t('common.closed') : t('common.close'))}</span>
          <span data-time={item.closingAt.toString()} className='meta-item meta-timeago ago'></span>
        </span>
      )
    }
  }

  render () {
    var voted = user.logged() && !!this.props.item.voted
    return (
      <li data-id={this.props.item.id}>
        <Link to={this.props.item.url} className={voted ? 'voted' : ''}>
          <div className='item-tag'>
            <img className='tag-img' src={tagImages[this.props.item.tag.image].url} />
            <img className='hexagon' src='/tags-images/hexagon.svg' />
          </div>
          <div className='item-text'>
            <div className='item-badges'>
              {
                ((voted) ? <img src='/boot/check.png' /> : null)
              }
            </div>
            <span className='title'>
              {this.props.item.mediaTitle}
            </span>
            <span className='created-by'>
              {this.createdBy(this.props.item)}
            </span>
          </div>
        </Link>
      </li>
    )
  }
}
