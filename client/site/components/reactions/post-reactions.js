import React from 'react'
import VoteLikeReaction from './vote-like-reaction'

export default class extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      reactions: []
    }
  }

  async componentDidMount () {
    const reactions = await (await fetch(`/api/v1.0/services/reactions/posts/${this.props.post._id}/results`)).json()
    this.setState({ reactions: reactions })
  }

  render () {
    const { post, user } = this.props
    // const { state } = this.state
    return (
      <section className='post-reactions'>
        { this.state.reactions.map((reaction) => {
          switch (reaction.reactionRule.method) {
            case 'LIKE':
              return <VoteLikeReaction key={reaction.id} user={user} reaction={reaction} />
            default:
              return 'Nothing :('
          }
        })
        }
        <style jsx>{`
          .post-reactions {
            padding: 30px 0;
            display: block;
          }
        `}</style>
      </section>
    )
  }
}
