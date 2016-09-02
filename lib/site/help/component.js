import React, {Component} from 'react'
import config from 'lib/config/config'
import Sidebar from 'lib/site/help/sidebar/component'
import MarkdownArticle from 'lib/site/help/md-article/component'
import MarkdownGuide from 'lib/site/help/md-guide/component'

export default class HelpLayout extends Component {
  constructor (props) {
    super(props)
    this.articles = {
      'faq':
        config.frequentlyAskedQuestions
          ? {__html: require('./faq.md')}
          : false,
      'terms-of-service':
        config.termsOfService
          ? {__html: require('./tos.md')}
          : false,
      'privacy-policy':
        config.privacyPolicy
          ? {__html: require('./pp.md')}
          : false,
      'glossary':
        config.glossary
          ? {__html: require('./glossary.md')}
          : false
    }
  }

  render () {
    console.log(this.articles)
    return (
      <div id='help-container'>
        <Sidebar articles={this.props.route.articles} />
        {
          (
            !this.props.params.article ||
            this.props.params.article === 'markdown'
          ) &&
            <MarkdownGuide />
        }
        {
          this.props.params.article &&
          this.props.params.article !== 'markdown' &&
          this.articles[this.props.params.article] &&
            <MarkdownArticle article={this.articles[this.props.params.article]} />
        }
        {this.props.children}
      </div>
    )
  }
}
