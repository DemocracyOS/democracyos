import React, {Component} from 'react'
import t from 't-component'
import tagImages from 'lib/tags-images'
import config from 'lib/config/config'
import topicStore from 'lib/stores/topic-store/topic-store'

export default class ProposalArticle extends Component {
  constructor (props) {
    super(props)
    this.state = {
      topic: null
    }
    this.getTopic = this.getTopic.bind(this)
  }

  componentDidMount () {
    if (this.props.params && this.props.params.topicId) {
      this.getTopic()
    }
  }

  componentWillReceiveProps (newProps) {
    if (newProps.topic) {
      this.setState({topic: newProps.topic})
    }
  }

  getTopic () {
    topicStore
      .findOne(this.props.params.topicId)
      .then((topic) => {
        this.setState({topic})
      })
  }

  render () {
    if (!this.state.topic) return null

    function createClauses (clauses) {
      return {
        __html: clauses
          .map(function (clause) {
            return clause.markup
          })
          .join('')
      }
    }
    var learnMore = config.learnMoreUrl
    var learnMoreContent = null
    if (learnMore) {
      learnMoreContent = (
        <div class='alert alert-warning alert-dismissable system-alert'>
          <button className='close' data-dismiss='alert' aria-hidden='true'></button>
          <span>{t('proposal-article.article.alert.text')}&nbsp;&nbsp;</span>
          <a href='{learnMore}' class='alert-link' target='_blank'>
            {t('proposal-article.article.alert.learn-more')}
          </a>
        </div>
      )
    }

    var closingAtContent
    var closed = this.state.topic.closed
    if (this.state.topic.closingAt) {
      closingAtContent = (
        <p>
          <i className='icon-time'>
            <span className='time-ago-label'>
              {(closed ? t('common.closed') : t('common.close')) + ' '}
            </span>
            <span
              className='meta-item meta-timeago ago'
              data-time={this.state.topic.closingAt.toString()} >
            </span>
          </i>
        </p>
      )
    } else {
      closingAtContent = (
        <p>
          <i className='icon-time'>
            <span className='meta-item meta-timeago'>
              {t('proposal-article.unknown-closing-date')}
            </span>
          </i>
        </p>
      )
    }

    var authorContent = null
    if (this.state.topic.author) {
      if (this.state.topic.authorUrl) {
        authorContent = (
          <h2 className='author'>{t('admin-topics-form.label.author')}:
            &nbsp;<a href={this.state.topic.authorUrl} target='_blank'></a>
          </h2>
        )
      } else {
        authorContent = (
          <h2 className='author'>{t('admin-topics-form.label.author')}:
            &nbsp;{this.state.topic.author}
          </h2>
        )
      }
    }

    var sourceContent = null
    if (this.state.topic.source) {
      sourceContent = (
        <div className='source'>
          <p>
            <span className='icon-link'></span>
            <a href={this.state.topic.source} target='_blank'>
              {t('proposal-article.view-original-text')}
            </a>
          </p>
        </div>
      )
    }

    var linksContent = null
    if (this.state.topic.links && this.state.topic.links.length) {
      linksContent = (
        <div className='links'>
          <h5>{t('common.more-information')}</h5>
          {
            Object.keys(this.state.topic.links)
              .map(function (link) {
                return (
                  <p key={link.url}>
                    <span className='icon-share'></span>
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

    return (
      <div className='inner-container'>
        {learnMoreContent}
        <article className='proposal commentable-container'>
          <div className='entry-tag' style={{borderColor: this.state.topic.tag.color}}>
            <img src={tagImages[this.state.topic.tag.image].url} style={{fill: 'white'}}/>
            <img className='hexagon' src='/tags-images/hexagon.svg' />
            <div style={{color: this.state.topic.tag.color}}>
              {this.state.topic.tag.name}
            </div>
          </div>
          <div className='meta-information'>
            {closingAtContent}
          </div>
          <h1>{this.state.topic.mediaTitle}</h1>
          {authorContent}
          <h3>{this.state.topic.title}</h3>
          <div className='entry-content'>
            <div
              className='clauses'  
              dangerouslySetInnerHTML={createClauses(this.state.topic.clauses)}>
            </div>
          </div>
          {sourceContent}
          {linksContent}
          <div className={'participants' + (this.state.topic.votable ? '' : 'hide')}></div>
          <div className='share-links'>
            <a 
              href={'http://www.facebook.com/sharer.php?u=' + window.location.origin + this.state.topic.url}
              target='_blank'
              className='flaticon social facebook'></a>
            <a 
              href={'http://twitter.com/share?text=' + (config.tweetText || this.state.topic.mediaTitle) + '&url=' + window.location.origin + this.state.topic.url}
              target='_blank'
              className='flaticon social twitter'></a>
          </div>
        </article>
      </div>
    )
  }
}
