import React, {Component} from 'react'
import { Link } from 'react-router'
import t from 't-component'

export default class Sidebar extends Component {
  render () {
    return (
      <div id='help-sidebar-container'>
        <div className='help-sidebar'>
          <h3>{t('help.title')}</h3>
          {
            this.props.articles.map((article, key) => {
              return (
                <Link
                  key={key}
                  to={article.path}>
                  {article.label}
                </Link>
              )
            })
          }
        </div>
      </div>
    )
  }
}
