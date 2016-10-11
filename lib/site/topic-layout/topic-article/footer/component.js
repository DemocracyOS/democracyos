import React, {Component} from 'react'
import t from 't-component'
import config from 'lib/config'

export default class Footer extends Component {
  render () {
    let source = null
    if (this.props.source) {
      source = (
        <div className='source'>
          <p>
            <span className='icon-link'></span>
            <a href={this.props.source} target='_blank'>
              {t('proposal-article.view-original-text')}
            </a>
          </p>
        </div>
      )
    }
    let links = null
    if (this.props.links && this.props.links.length) {
      links = (
        <div className='links'>
          <h5>{t('common.more-information')}</h5>
          {
            this.props.links
              .map(function (link) {
                return (
                  <p key={link.url}>
                    <span className='icon-share-alt'></span>
                    <a href={link.url} target='_blank'>
                      {link.text}
                    </a>
                  </p>
                )
              })
          }
        </div>
      )
    }

    let socialLinksUrl = window.location.origin + this.props.socialUrl
    let twitterText = config.tweetText || this.props.title
    return (
      <div className='topic-footer topic-article-content'>
        {source}
        {links}
        <div className='share-links'>
          <a
            href={'http://www.facebook.com/sharer.php?u=' + socialLinksUrl}
            target='_blank'
            className='flaticon social facebook'></a>
          <a
            href={'http://twitter.com/share?text=' + twitterText + '&url=' + socialLinksUrl}
            target='_blank'
            className='flaticon social twitter'></a>
        </div>
      </div>
    )
  }
}
