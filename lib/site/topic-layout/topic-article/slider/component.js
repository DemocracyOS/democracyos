import React, { Component } from 'react'
import InputRange from 'react-input-range'
import t from 't-component'
import userConnector from 'lib/site/connectors/user'
import topicStore from 'lib/stores/topic-store/topic-store'

class Slider extends Component {
  constructor (props) {
    super(props)
    this.state = {
      value: 50,
      voted: false,
      changingVote: false,
      votes: {
        '0-25': [],
        '25-50': [],
        '50-75': [],
        '75-100': []
      }
    }

    this.handleVote = this.handleVote.bind(this)
  }

  componentWillMount () {
    const { topic } = this.props
    const newState = this.fillStateWithResults(topic)
    this.setState(newState)
  }

  handleVote (e) {
    if (!this.props.user.state.fulfilled) return

    const { value } = this.state
    topicStore
      .vote(this.props.topic.id, value.toString())
      .then(() => {
        this.setState({
          voted: true,
          changingVote: false
        })
      })
      .catch((err) => {
        console.warn('Error on vote setState', err)
        this.setState({
          voted: false
        })
      })
  }

  render () {
    const { value, voted, changingVote } = this.state
    const { topic, user } = this.props

    return (
      <div className='topics-slider'>
        <InputRange
          maxValue={100}
          minValue={0}
          value={value}
          disabled={!!topic.voted || !!voted}
          onChange={(value) => this.setState({ value })} />
        {
          (!(topic.closed || topic.voted) || changingVote) &&
            <VoteBox onVote={this.handleVote} />
        }
        {
        user.state.fulfilled &&
        !topic.privileges.canVote &&
          <p className='text-mute overlay-vote'>
            <span className='icon-lock' />
            <span className='text'>
              {t('privileges-alert.not-can-vote-and-comment')}
            </span>
          </p>
        }
      </div>
    )
  }
}

function VoteBox ({ onVote }) {
  return (
    <div className='vote-box'>
      <div className='vote-options'>
        <div className='direct-vote'>
          <button
            className='btn btn-primary'
            onClick={onVote}>
            {t('topics.actions.poll.do')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default userConnector(Slider)
