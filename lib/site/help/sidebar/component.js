import React, {Component} from 'react'
import { Link } from 'react-router'
import t from 't-component'
import config from 'lib/config'

export default class Sidebar extends Component {
  constructor (props) {
    super(props)
    this.articles = [
      config.frequentlyAskedQuestions
        ? {
          label: t('help.faq.title'),
          path: '/help/faq'
        }
        : false,
      config.termsOfService
        ? {
          label: t('help.tos.title'),
          path: '/help/terms-of-service'
        }
        : false,
      config.privacyPolicy
        ? {
          label: t('help.pp.title'),
          path: '/help/privacy-policy'
        }
        : false,
      config.glossary
        ? {
          label: t('help.glossary.title'),
          path: '/help/glossary'
        }
        : false,
      {
        label: t('help.markdown.title'),
        path: '/help/markdown'
      }
    ].filter(p => p)
  }

  render () {
    return (
      <div id='help-sidebar-container'>
        <div className='help-sidebar'>
          {
            this.articles.map((article, key) => {
              return (
                <Link key={key} to={article.path}>{article.label}</Link>
              )
            })
          }
        </div>
      </div>
    )
  }
}
