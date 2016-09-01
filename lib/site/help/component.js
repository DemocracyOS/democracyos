import React, {Component} from 'react'
import Sidebar from 'lib/site/help/sidebar/component'

export default class HelpLayout extends Component {
  render () {
    return (
      <div id='help-container'>
        <Sidebar articles={this.props.route.articles} />
        {this.props.children}
      </div>
    )
  }
}
