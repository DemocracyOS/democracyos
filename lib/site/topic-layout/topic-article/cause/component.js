import React, { Component } from 'react'
import t from 't-component'
import topicStore from 'lib/stores/topic-store/topic-store'
import userConnector from 'lib/site/connectors/user'
import CantComment from '../cant-comment/component'
import Required from '../required/component'

export class Cause extends Component {
  state = {
    showResults: false,
    results: null
  }

  componentWillMount () {
    this.setStateFromProps(this.props)
  }

  componentWillReceiveProps (props) {
    this.setStateFromProps(props)
  }

  setStateFromProps (props) {
    const { topic } = props

    return this.setState({
      closed: topic.closed,
      supported: !!topic.voted
    })
  }

  handleSupport = (e) => {
    if (this.state.closed) return

    topicStore.vote(this.props.topic.id, 'support')
      .catch((err) => { throw err })
  }

  render () {
    const { user, topic } = this.props

    if (user.state.pending) return null

    const { supported } = this.state
    const showResults = topic.closed
    const cantComment = user.state.fulfilled && !topic.privileges.canVote
    const isRequired = !user.state.fulfilled && !showResults
    const showVoteButton = user.state.fulfilled && !supported && !showResults
    const showChangeVote = !showResults && supported

    return (
      <div className='topics-cause'>
        {showChangeVote && (
          <div className='voted-box'>
            <div className='alert alert-info alert-voted' role='alert'>
              <span className='icon-info bold' />
              <span className='black bold thanks'>{t('topics.actions.thanks')}</span>
              <span className='black'>{t('topics.actions.feedback')}</span>
            </div>
            <button
              className='btn btn-secondary'
              onClick={this.handleSupport}>
              <i className='icon-heart' />
              &nbsp;
              {t('topics.actions.cause.done')}
            </button>
          </div>
        )}
        {showVoteButton && (
          <button
            className='btn btn-primary'
            onClick={this.handleSupport}>
            <i className='icon-heart' />
            &nbsp;
            {t('topics.actions.cause.do')}
          </button>
        )}
        {
          isRequired && (
            <Required />
          )
        }
        {
          cantComment && (
            <CantComment />
          )
        }
      </div>
    )
  }
}

export default userConnector(Cause)
