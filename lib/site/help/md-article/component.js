import React, {Component} from 'react'

export default class MarkdownArticle extends Component {
  render () {
    console.log(this.props.article)
    return (
      <div className='article-container'>
        <div
          className='article-content'
          dangerouslySetInnerHTML={this.props.article}>
        </div>
      </div>
    )
  }
}
