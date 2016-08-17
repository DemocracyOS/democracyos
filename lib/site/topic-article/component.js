import React, {Component} from 'react'
import Header from './header/component'
import Content from './content/component'
import Footer from './footer/component'
import Participants from './participants/component'
import DecisionMaker from './decision-maker/component'

export default class TopicArticle extends Component {
  render () {
    if (!this.props.topic) return null
    return (
      <div className='inner-container'>
        <Header
          closingAt={this.props.topic.closingAt}
          closed={this.props.topic.closed}
          author={this.props.topic.author}
          authorUrl={this.props.topic.authorUrl}
          tag={this.props.topic.tag}
          mediaTitle={this.props.topic.mediaTitle} />
        <Content
          clauses={this.props.topic.clauses} />
        <Footer
          source={this.props.topic.source}
          links={this.props.topic.links}
          socialUrl={this.props.topic.url}
          title={this.props.topic.mediaTitle} />
        <Participants />
        <DecisionMaker
          upvotes={this.props.topic.upvotes}
          downvotes={this.props.topic.downvotes}
          abstentions={this.props.topic.abstentions}
          participants={this.props.topic.participants}
          closingAt={this.props.topic.closingAt}
          id={this.props.topic.id}
          url={this.props.topic.url}
          canVote={this.props.privileges && this.props.privileges.canVoteAndComment} />
      </div>
    )
  }
}
