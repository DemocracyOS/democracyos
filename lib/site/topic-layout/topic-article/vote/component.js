import React, { Component } from 'react'
import Chart from 'chart.js'
import t from 't-component'
import topicStore from 'lib/stores/topic-store/topic-store'
import userConnector from 'lib/site/connectors/user'
import ChangeVote from '../change-vote-button/component'
import CantComment from '../cant-comment/component'
import Required from '../required/component'
import voteOptions from './vote-options'

class Vote extends Component {
  constructor (props) {
    super(props)
    this.options = voteOptions

    this.state = {
      votes: {
        positives: [],
        neutrals: [],
        negatives: []
      },
      alert: {
        className: '',
        text: '',
        hide: true
      },
      voted: false,
      changingVote: false
    }
  }

  componentWillMount () {
    let newState = this.prepareState(this.props.topic)
    this.setState(newState)
  }

  componentWillReceiveProps (props) {
    let newState = this.prepareState(props.topic)
    this.setState(newState)
  }

  prepareState (topic) {
    let votes = {
      positive: new Array(parseInt(topic.action.results.find((o) => o.value === 'positive').percentage * topic.action.count)) || [],
      negative: new Array(parseInt(topic.action.results.find((o) => o.value === 'negative').percentage * topic.action.count)) || [],
      neutral: new Array(parseInt(topic.action.results.find((o) => o.value === 'neutral').percentage * topic.action.count)) || []
    }

    let voted = false
    let alert = {
      className: '',
      text: '',
      hide: true
    }

    if (this.props.user.state.fulfilled) {
      Object.keys(votes).forEach((votedValue) => {
        if (!votes[votedValue] === 0) return

        const ownVote = topic.voted === votedValue

        if (ownVote) {
          voted = true
          alert = {
            className: this.options[votedValue].alert.className,
            text: this.options[votedValue].alert.text,
            hide: false
          }
        }
      })
    }

    return {
      topic,
      voted: voted,
      votes: votes,
      alert: alert
    }
  }

  handleVote = (e) => {
    if (!this.props.user.state.fulfilled) return

    const voteValue = e.currentTarget.getAttribute('data-vote')
    topicStore
      .vote(this.props.topic.id, voteValue)
      .then(() => {
        this.setState({
          voted: true,
          changingVote: false,
          alert: Object.assign({}, this.options[voteValue].alert, { hide: false })
        })
      })
      .catch((err) => {
        console.warn('Error on vote setState', err)
        this.setState({
          alert: {
            className: 'alert-warning',
            text: 'proposal-options.error.voting',
            hide: false
          },
          voted: false
        })
      })
  }

  changeVote = () => {
    this.setState({
      changingVote: true
    })
  }

  resultChartDidMount = (resultChart) => {
    if (!resultChart) return
    let votes = this.state.votes
    let votesTotal = this.state.topic.action.count
    let data = []

    if (votesTotal) {
      data.push({
        value: votes.positive.length,
        color: this.props.positiveColor,
        label: t('proposal-options.yea'),
        labelColor: 'white',
        labelAlign: 'center'
      })
      data.push({
        value: votes.neutral.length,
        color: this.props.neutralColor,
        label: t('proposal-options.abstain'),
        labelColor: 'white',
        labelAlign: 'center'
      })
      data.push({
        value: votes.negative.length,
        color: this.props.negativeColor,
        label: t('proposal-options.nay'),
        labelColor: 'white',
        labelAlign: 'center'
      })

      new Chart(resultChart.getContext('2d'))
        .Pie(data, { animation: false }) // eslint-disable-line new-cap
    }
  }

  render () {
    const { user, topic } = this.props

    const votes = this.state.votes
    const votesTotal = topic.action.count
    const closed = topic.closed

    const showResult = closed
    const showVoteBox = user.state.fulfilled && !showResult && (!this.state.voted || this.state.changingVote)
    const showAlert = !(this.state.alert.hide || this.state.changingVote) && !showResult
    const cantComment = user.state.fulfilled && !topic.privileges.canVote
    const isRequired = !user.state.fulfilled && !showResult

    const voted = topic.voted

    const values = {
      'neutral': t('proposal-options.abstain'),
      'positive': t('proposal-options.yea'),
      'negative': t('proposal-options.nay')
    }

    return (
      <div className='proposal-options topic-article-content'>
        {
          showAlert && (
            <div>
              <VotedBox vote={topic.voted} />
              { // <div
                // className={this.state.alert.className + ' alert'}>
                // {this.state.alert.text && t(this.state.alert.text)}.
                // </div>
              }
              <ChangeVote handleClick={this.changeVote} />
            </div>
          )
        }
        {
          showResult && (
            <div className='result-wrapper'>
              { voted &&
                <p className='chosen-answer'>{t('proposal-options.voted-positive-percentage', { vote: values[voted] })}</p>
              }
              <ResultBox
                results={this.props.topic.action.results}
                count={this.props.topic.action.count}
                votes={votes}
                votesTotal={votesTotal}
                options={this.options}
                resultChartDidMount={this.resultChartDidMount} />
            </div>
          )
        }
        {
          showVoteBox && (
            <VoteBox options={this.options} onVote={this.handleVote} />
          )
        }
        <div className='votes-cast'>
          <em className='text-muted'>
            {t('proposal-options.votes-cast', { num: votesTotal })}
          </em>
        </div>
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

export default userConnector(Vote)

function ResultBox (props) {
  const votesTotal = props.votesTotal
  const votes = props.votes
  const resultChartDidMount = props.resultChartDidMount
  const options = props.options

  return (
    <div className='results-box topic-article-content row'>
      <p className='alert alert-info col-sm-12'>
        <label>
          {
            votesTotal === 0
              ? t('proposal-options.no-votes-cast')
              : t('proposal-options.votes-cast', { num: votesTotal })
          }
        </label>
      </p>
      <div className='results-chart col-sm-6'>
        <canvas
          id='results-chart'
          width='220'
          height='220'
          ref={resultChartDidMount} />
      </div>
      <div className='results-summary col-sm-6'>
        {
          Object.keys(votes)
            .map(function (v) {
              const votesByType = votes[v]
              const option = options[v].button

              if (votesByType.length === 0) return null

              let width = props.results.find((r) => r.value === v).percentage
              width = Math.round(width * 100) / 100

              let s = votesByType.length === 1 ? '' : 's'

              return (
                <div className={option.className + ' votes-results'} key={v}>
                  <h5>{t(option.text)}</h5>
                  <span className='percent'>{width}%</span>
                  <span className='votes'>
                    {props.count}
                    {t('proposal-options.vote-item') + s}
                  </span>
                </div>
              )
            })
        }
      </div>
    </div>
  )
}

function VoteBox ({ options, onVote }) {
  return (
    <div className='vote-box'>
      <div className='vote-options'>
        <h5>{t('proposal-options.vote')}</h5>
        <div className='direct-vote'>
          {
            Object.keys(options).map(function (o) {
              const option = options[o]
              return (
                <a
                  className={'vote-option ' + option.button.className}
                  data-vote={o}
                  onClick={onVote}
                  key={o}>
                  <i className={option.button.icon} />
                  <span>{t(option.button.text)}</span>
                </a>
              )
            })
          }
        </div>
      </div>
    </div>
  )
}

function VotedBox ({ vote }) {
  const values = {
    'neutral': t('proposal-options.abstain'),
    'positive': t('proposal-options.yea'),
    'negative': t('proposal-options.nay')
  }

  return (
    <div className='voted-box'>
      <div className='alert alert-info alert-voted' role='alert'>
        <span className='icon-info bold' />
        <span className='black bold thanks'>{t('topics.actions.thanks')}</span>
        <span className='black'>{t('topics.actions.feedback')}</span>
      </div>
      <p className='chosen-answer'>{t('proposal-options.voted-positive-percentage', { vote: values[vote] })}</p>
    </div>
  )
}
