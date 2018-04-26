import React from 'react'
import { fetchWrapper } from '../../../utils/fetch-wrapper'
import Results from './results-like-reaction'
import PleaseLogInModal from './please-login-modal'
import VotingClosedModal from './voting-closed-modal'

export default class extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      reaction: this.props.reaction,
      myVote: null,
      justVoted: null,
      pleaseLogIn: false,
      voteClosed: false
    }
    this.closeModalVoteClosed = this.closeModalVoteClosed.bind(this)
    this.closeModalPleaseLogIn = this.closeModalPleaseLogIn.bind(this)
  }

  async componentWillMount () {
    if (this.props.user !== undefined) {
      let vote = this.state.reaction.userVote
      if (vote !== undefined) {
        this.setState({ myVote: vote })
      }
    } else {
      this.setState({ myVote: null })
    }
  }

  voteAction = async () => {
    if (this.props.user === undefined) {
      this.setState({
        pleaseLogIn: true
      })
    } else {
      // No. Then lets create his firt vote
      const url = `/api/v1.0/services/reactions/${this.state.reaction.id}/vote`
      const options = {
        'headers': { 'Content-Type': 'application/json' },
        credentials: 'include',
        method: 'POST',
        body: {}
      }
      let response = await (await fetchWrapper(url, options)).json()
      const urlUpdate = `/api/v1.0/services/reactions/${this.state.reaction.id}/result`
      const optionsUpdate = {
        'headers': { 'Content-Type': 'application/json' },
        credentials: 'include',
        method: 'GET'
      }
      let updatedReaction = await (await fetchWrapper(urlUpdate, optionsUpdate)).json()
      this.setState({
        myVote: response,
        reaction: updatedReaction,
        justVoted: true
      })
    }
  }

  closeModalVoteClosed = (e) => {
    this.setState({ voteClosed: false })
  }

  closeModalPleaseLogIn = (e) => {
    this.setState({ pleaseLogIn: false })
  }

  showModalVoteClosed = (e) => {
    this.setState({ voteClosed: true })
  }

  render () {
    const state = this.state

    return (
      <section className='reaction-wrapper reaction-vote'>
        {state.pleaseLogIn ? <PleaseLogInModal closeModal={this.closeModalPleaseLogIn} /> : null}
        {state.voteClosed ? <VotingClosedModal closeModal={this.closeModalVoteClosed} /> : null}
        <div className='reaction-content'>
          { state.reaction.reactionRule.closingDate && (new Date() - new Date(state.reaction.reactionRule.closingDate) < 0)
            // If true => You can vote.
            ? <button className={'vote-reaction ' + (state.myVote !== null && !state.myVote.meta.deleted ? 'has-voted' : 'hasnt-voted')}
              disabled={state.myVote !== null && state.myVote.meta.timesVoted >= state.reaction.reactionRule.limit}
              onClick={this.voteAction}>{(state.myVote !== null && !state.myVote.meta.deleted ? '✅' : '❓')}
            </button>
            : <button onClick={this.showModalVoteClosed} className='vote-reaction voting-closed'>⛔
            </button>
          }
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
            background-color:  #4b4b4b;
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
            color: #4b4b4b
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
            background-color: #4b4b4b;            
          }
          .vote-reaction.hasnt-voted:hover{
            color: #4b4b4b
            background-color: #FFF;            
          }
          .vote-reaction.voting-closed{
            color: #00000
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
