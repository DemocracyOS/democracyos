import React, { Component } from 'react'
import t from 't-component'

export default class Footer extends Component {
  render () {
    let source = null
    if (this.props.source) {
      source = (
        <div className='source'>
          <p>
            <span className='icon-link' />
            <a
              href={this.props.source}
              target='_blank'
              rel='noopener noreferrer'>
              {t('proposal-article.view-original-text')}
            </a>
          </p>
        </div>
      )
    }
    let links = null
    if (this.props.links && this.props.links.length > 0) {
      links = (
        <div className='links'>
          <h5>{t('common.more-information')}</h5>
          {
            this.props.links
              .map(function (link) {
                if (!link.text) return null
                return (
                  <p key={link._id}>
                    <span className='icon-share-alt' />
                    <a
                      href={link.url}
                      target='_blank'
                      rel='noopener noreferrer'>
                      {link.text}
                    </a>
                  </p>
                )
              })
          }
        </div>
      )
    }

    return (
      <div className='topic-footer topic-article-content'>
        {source}
        {links}
      </div>
    )
  }
}
