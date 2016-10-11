import React, {Component} from 'react'
import user from 'lib/user/user'
import t from 't-component'
import tagImages from 'lib/tags-images'
import {Link} from 'react-router'

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

  render () {
    const voted = user.logged() && this.props.item.voted

    return (
      <li className='sidebar-link' data-id={this.props.item.id}>
        <Link
          to={this.props.item.url}
          className={(voted ? 'voted' : '') + (this.props.active ? ' active' : '')}
          activeClassName='active'>
          <div className='item-tag'>
            <img
              className='tag-img'
              src={tagImages[this.props.item.tag.image].url} />
            <img
              className='hexagon'
              src='/lib/tags-images/hexagon.svg' />
          </div>
          <div className='item-text'>
            <span className='title'>
              {this.props.item.mediaTitle}
              {voted && <i className='icon-check' />}
            </span>
            <span className='created-by'>
              <CreatedBy item={this.props.item} />
            </span>
          </div>
        </Link>
      </li>
    )
  }
}

function CreatedBy (props) {
  const item = props.item

  if (item.participants.length > 0) {
    const cardinality = item.participants.length === 1 ? 'singular' : 'plural'
    const msg = t('proposal-article.participant.' + cardinality)
    return <span>{item.participants.length + ' ' + msg}</span>
  }

  if (item.closingAt) {
    const closed = Number(new Date(item.closingAt)) < Date.now()

    return (
      <span>
        <span
          className='time-ago-label'>
          {(closed ? t('common.closed') : t('common.close'))}
        </span>
        &nbsp;
        <span
          data-time={item.closingAt.toString()}
          className='meta-item meta-timeago ago' />
      </span>
    )
  }

  return null
}
