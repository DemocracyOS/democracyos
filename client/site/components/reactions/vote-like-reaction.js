import React from 'react'
import Results from './results-like-reaction'
import ActionFavorite from 'material-ui/svg-icons/action/favorite'
import ActionFavoriteBorder from 'material-ui/svg-icons/action/favorite-border'


export default class extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      reaction: this.props.reaction,
      myVote: null,
      justVoted: null
    }
  }

  async componentWillMount () {
    let vote = this.state.reaction.participants.find((x) => { return x.userId._id == this.props.user.id })
    if (vote !== undefined) {
      this.setState({ myVote: vote })
    }
  }

  voteAction = async () => {
    // Has the user voted?
    if (this.state.myVote != null) {
      const body = {
        userId: this.props.user.id,
        reactionVoteId: this.state.myVote._id,
        reactionRule: this.state.reaction.reactionRule
      }
      // No. Then lets create his firt vote
      let response = await (await fetch(`/api/v1.0/services/reactions/${this.state.reaction.id}/vote`, {
        'body': JSON.stringify(body),
        'method': 'POST',
        'headers': {
          'Content-Type': 'application/json'
        }
      })).json()
      let updatedReaction = await (await fetch(`/api/v1.0/services/reactions/${this.state.reaction.id}/result`)).json()
      this.setState({
        myVote: response,
        reaction: updatedReaction,
        justVoted: true
      })
    } else {
      const body = {
        userId: this.props.user.id,
        reactionRule: this.state.reaction.reactionRule
      }
      // No. Then lets create his firt vote
      let response = await (await fetch(`/api/v1.0/services/reactions/${this.state.reaction.id}/vote`, {
        'body': JSON.stringify(body),
        'method': 'POST',
        'headers': {
          'Content-Type': 'application/json'
        }
      })).json()
      let updatedReaction = await (await fetch(`/api/v1.0/services/reactions/${this.state.reaction.id}/result`)).json()
      this.setState({
        myVote: response,
        reaction: updatedReaction,
        justVoted: true
      })
      // this.setState({ myVote: response })
      // this.setState({ justVoted: true })
    }
  }

  render () {
    const state = this.state
    return (
      <section className='reaction-wrapper reaction-vote'>
        <div className='reaction-content'>
          <button className={'vote-reaction ' + (state.myVote !== null && !state.myVote.meta.deleted ? 'has-voted' : 'hasnt-voted')}
            disabled={state.myVote !== null && state.myVote.meta.timesVoted >= state.reaction.reactionRule.limit}
            onClick={this.voteAction}>{(state.myVote !== null && !state.myVote.meta.deleted ? '♥' : '♡')}</button>
          <h3 className='reaction-title'>{state.reaction.title}</h3>
          <h6 className='reaction-instruction'>{state.reaction.instruction}</h6>
        </div>

        {state.myVote !== null && state.justVoted ? <div className='reaction-just-voted'>Saved! Thanks for voting!</div> : ''}
        {state.myVote !== null && state.myVote.meta.timesVoted >= state.reaction.reactionRule.limit ? <div className='reaction-limit-reached'>You've reached the max ammount of votes.</div> : ''}
        <Results reaction={state.reaction} />
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
          .reaction-just-voted{
            background-color: #52862E;
            color: #fff;
            padding: 4px 15px;
            text-align: right; 
          }
          .reaction-limit-reached{
            background-color: #FFD14D;
            color: #141414;
            padding: 4px 15px;
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
