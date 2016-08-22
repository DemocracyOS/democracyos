import React, {Component} from 'react'
import Header from './header/component'
import Content from './content/component'
import Footer from './footer/component'
import Participants from './participants/component'
import DecisionMaker from './decision-maker/component'

export default class TopicArticle extends Component {
  render () {
    let topic = this.props.topic
    let privileges = this.props.privileges
    if (!topic) return null
    console.log(topic.participants, topic)
    return (
      <div className='inner-container'>
        <Header
          closingAt={topic.closingAt}
          closed={topic.closed}
          author={topic.author}
          authorUrl={topic.authorUrl}
          tag={topic.tag}
          mediaTitle={topic.mediaTitle} />
        <Content
          clauses={topic.clauses} />
        <Footer
          source={topic.source}
          links={topic.links}
          socialUrl={topic.url}
          title={topic.mediaTitle} />
        <Participants
          participants={topic.participants} />
        <DecisionMaker
          upvotes={topic.upvotes}
          downvotes={topic.downvotes}
          abstentions={topic.abstentions}
          closed={topic.closed}
          id={topic.id}
          url={topic.url}
          closingAt={topic.closingAt}
          canVote={privileges && privileges.canVoteAndComment} />
      </div>
    )
  }
}

