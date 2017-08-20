import React, { Component } from 'react'
import t from 't-component'
import { Link } from 'react-router'
import tagImages from 'lib/tags-images'
import userConnector from 'lib/site/connectors/user'

class ListItem extends Component {
  render () {
    const voted = this.props.user.state.fulfilled && this.props.item.voted

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

export default userConnector(ListItem)

function CreatedBy (props) {
  const item = props.item

  if (item.action.count > 0) {
    const cardinality = item.action.count === 1 ? 'singular' : 'plural'
    const msg = t('proposal-article.participant.' + cardinality)
    return <span>{item.action.count + ' ' + msg}</span>
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
