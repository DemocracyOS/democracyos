import React, {Component} from 'react'
import t from 't-component'
import tagImages from 'lib/tags-images'
import config from 'lib/config/config'

export default class Header extends Component {
  render () {
    var learnMore = null
    if (config.learnMoreUrl) {
      learnMore = (
        <div class='alert alert-warning alert-dismissable system-alert'>
          <button className='close' data-dismiss='alert' aria-hidden='true'></button>
          <span>{t('proposal-article.article.alert.text')}&nbsp;&nbsp;</span>
          <a href='{config.learnMoreUrl}' class='alert-link' target='_blank'>
            {t('proposal-article.article.alert.learn-more')}
          </a>
        </div>
      )
    }

    var closingAt
    if (this.props.closingAt) {
      closingAt = (
        <p className='meta-information'>
          <i className='icon-clock'></i>
          <span className='time-ago-label'>
            {(this.props.closed ? t('common.closed') : t('common.close')) + ' '}
          </span>
          <span
            className='meta-item meta-timeago ago'
            data-time={this.props.closingAt.toString()} >
          </span>
        </p>
      )
    } else {
      closingAt = (
        <div className='meta-information'>
          <p>
            <i className='icon-clock'></i>
            <span className='meta-item meta-timeago'>
              {t('proposal-article.unknown-closing-date')}
            </span>
          </p>
        </div>
      )
    }

    let author = null
    if (this.props.author) {
      let authorName
      if (this.props.authorUrl) {
        authorName = <a href={this.props.authorUrl} target='_blank'>{this.props.author}</a>
      } else {
        authorName = this.props.author
      }
      author = (
        <h2 className='author'>{t('admin-topics-form.label.author')}:
          &nbsp;{authorName}
        </h2>
      )
    }
    return (
      <header className='topic-article-content'>
        {learnMore}
        <div
          className='entry-tag'
          style={{borderColor: this.props.tag.color}}>
          <div className='tag-image-wrapper'>
            <img
              className='tag-image'
              src={tagImages[this.props.tag.image].url} />
            <img className='hexagon' src='/lib/tags-images/hexagon.svg' />
          </div>
          <h4 style={{color: this.props.tag.color}}>
            {this.props.tag.name}
          </h4>
        </div>
        {closingAt}
        <h1>{this.props.mediaTitle}</h1>
        {author}
      </header>
    )
  }
}
