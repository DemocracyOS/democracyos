import React from 'react'
import VoteLikeReaction from './vote-like-reaction'
import Results from './results-like-reaction'

export default class extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      myVote: null,
      justVoted: null
    }
  }

  async componentWillMount () {
    let vote = this.props.reaction.participants.find((x) => { return x.userId._id == this.props.user.id })
    if (vote != undefined) {
      this.setState({ myVote: vote })
    }
  }

  voteAction = async () => {
    // Has the user voted?
    if (this.state.myVote != null) {
      const body = {
        userId: this.props.user.id,
        reactionVoteId: this.state.myVote._id,
        reactionRule: this.props.reaction.reactionRule
      }
      // No. Then lets create his firt vote
      let response = await (await fetch(`/api/v1.0/services/reactions/${this.props.reaction.id}/vote`, {
        'body': JSON.stringify(body),
        'method': 'POST',
        'headers': {
          'Content-Type': 'application/json'
        }
      })).json()
      this.setState({ myVote: response })
      this.forceUpdate()
    } else {
      const body = {
        userId: this.props.user.id,
        reactionRule: this.props.reaction.reactionRule
      }
      // No. Then lets create his firt vote
      let response = await (await fetch(`/api/v1.0/services/reactions/${this.props.reaction.id}/vote`, {
        'body': JSON.stringify(body),
        'method': 'POST',
        'headers': {
          'Content-Type': 'application/json'
        }
      })).json()
      this.setState({ myVote: response })
      this.forceUpdate()
    }
  }

  render () {
    const { user, reaction } = this.props
    const state = this.state
    return (
      <section className='reaction-wrapper reaction-vote'>
        <div className='reaction-content'>
          <button className={'vote-reaction ' + (state.myVote ? 'has-voted' : 'hasnt-voted')} onClick={this.voteAction}>{(state.myVote ? ':D' : 'Vote!')}</button>
          <h3 className='reaction-title'>{reaction.title}</h3>
          <h6 className='reaction-instruction'>{reaction.instruction}</h6>
        </div>
        <Results reaction={reaction} />
        <style jsx>{`
          .reaction-wrapper {
            margin-bottom: 10px;
          }
          .reaction-content{
            position:relative;            
            color: #FFF;
            overflow: auto;
            padding: 1.25rem 1rem;
            background-color:  #1b85b8;
            border-top-left-radius: 10px;
            border-top-right-radius: 10px;
          }
          .vote-reaction{
            display:block;
            border: 0;
            float: right;
            margin-left: 10px;
            padding: 1rem 1.50rem;
            border: 2px dotted #FFF;
            border-radius: 5px;
            font-size: 2rem
            min-width: 130px
          }
          .vote-reaction.has-voted{
            color: #1b85b8
            background-color: #FFF;            

          }
          .vote-reaction.hasnt-voted{
            background-color: transparent;
            color: #FFF
          }
          .vote-reaction:hover{
              cursor: pointer;
          }
          .vote-reaction.has-voted:hover{
            color: #FFF
            background-color: #1b85b8;            
          }
          .vote-reaction.hasnt-voted:hover{
            color: #1b85b8
            background-color: #FFF;            
          }
          .reaction-title{
            font-weight: 800;
            line-height: normal;
          }
        `}</style>
      </section>
    )
  }
}
