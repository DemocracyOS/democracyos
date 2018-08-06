import React, { Component } from 'react'
import InputRange from 'react-input-range'
import { VictoryChart, VictoryBar, Bar, VictoryAxis, VictoryTooltip } from 'victory'
import t from 't-component'
import userConnector from 'lib/site/connectors/user'
import topicStore from 'lib/stores/topic-store/topic-store'
import ChangeVote from '../change-vote-button/component'
import CantComment from '../cant-comment/component'
import Required from '../required/component'

const labels = [
  [
    t('proposal-result.very-against'),
    t('proposal-result.middle-high-against'),
    t('proposal-result.middle-against'),
    t('proposal-result.little-against')
  ],
  [
    t('proposal-result.little-support'),
    t('proposal-result.middle-support'),
    t('proposal-result.middle-high-support'),
    t('proposal-result.very-support')
  ]
]

class Slider extends Component {
  constructor (props) {
    super(props)
    this.state = {
      value: this.props.topic.voted ? Number(this.props.topic.voted) : 0,
      voted: this.props.topic.voted !== false,
      changingVote: false,
      colored: false
    }

    this.handleVote = this.handleVote.bind(this)
    this.onChange = this.onChange.bind(this)
  }

  onChange (e) {
    const colored = (e) => {
      if (e === 0) return false
      if (e > 0) {
        return 'positive'
      } else {
        return 'negative'
      }
    }
    this.setState({
      value: e,
      colored: colored(e)
    })
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

  changeVote = () => {
    this.setState({
      changingVote: true
    })
  }

  render () {
    const { value, changingVote, colored } = this.state
    const { topic, user } = this.props

    const votesTotal = topic.action.count

    const showResults = topic.closed
    const showRange = user.state.fulfilled && (!(showResults || topic.voted) || changingVote)
    const showChangeVote = (!showResults && topic.voted) && !changingVote
    const cantComment = user.state.fulfilled && !topic.privileges.canVote
    const isRequired = !user.state.fulfilled && !showResults

    return (
      <div className={`topics-slider ${colored !== false ? colored : 'neutral'}`}>
        {
          showRange && <div className='container-fluid'>
            <div className='input-great-labels'>
              <span>{t('proposal-result.middle-against')}</span>
              <span>{t('proposal-result.middle-support')}</span>
            </div>
            <InputRange
              maxValue={100}
              minValue={-100}
              step={25}
              value={value}
              formatLabel={(value) => fillFormatLabel(value)}
              onChange={this.onChange} />
            <div className='input-small-container'>
              {labels.map((container, i) => (
                <div className='input-small-wrapper' key={i}>
                  {container.map((label, i) => (
                    <div className='input-small-label' key={i}>
                      <span>{label}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <VoteBox onVote={this.handleVote} />
          </div>
        }
        {
          showChangeVote && <span>
            <VotedBox num={value} />
            <ChangeVote handleClick={this.changeVote} />
          </span>
        }
        {showResults && topic.voted &&
          <VotedAnswer value={topic.voted} />
        }
        {
          showResults && <ResultBox
            votesTotals={votesTotal}
            results={topic.action.results} />
        }
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

const fillFormatLabel = (value) => {
  const range = {
    '-100': t('proposal-result.very-against'),
    '-75': t('proposal-result.middle-high-against'),
    '-50': t('proposal-result.middle-against'),
    '-25': t('proposal-result.little-against'),
    '0': t('proposal-result.neutral'),
    '25': t('proposal-result.little-support'),
    '50': t('proposal-result.middle-support'),
    '75': t('proposal-result.middle-high-support'),
    '100': t('proposal-result.very-support')
  }

  return range[value]
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

function VotedAnswer ({ value }) {
  const text = value > 0
    ? 'proposal-options.voted-positive-percentage'
    : 'proposal-options.voted-negative-percentage'

  return (
    <div className='voted-box'>
      <p>{t(text, { vote: fillFormatLabel(value) })}</p>
    </div>
  )
}

function VotedBox ({ num }) {
  const text = num > 0
    ? 'proposal-options.voted-positive-percentage'
    : 'proposal-options.voted-negative-percentage'

  return (
    <div className='voted-box'>
      <div className='alert alert-info alert-voted' role='alert'>
        <span className='icon-info bold' />
        <span className='black bold thanks'>{t('topics.actions.thanks')}</span>
        <span className='black'>{t('topics.actions.feedback')}</span>
      </div>
      <p>{t(text, { vote: fillFormatLabel(num) })}</p>
    </div>
  )
}

function ResultBox ({ votesTotals, results }) {
  const noVoted = votesTotals === 0
  if (noVoted) {
    return (
      <div className='results-box topic-article-content row'>
        <p className='alert alert-info col-sm-12'>
          {t('proposal-options.no-votes-cast')}
        </p>
      </div>
    )
  }

  const positive = results.filter((row) => row.value > 0)
  const negative = results.filter((row) => row.value < 0)

  return (
    <div className='row row-result'>
      <div className='col-xs-12 col-md-6'>
        <VictoryChart
          height={350}
          width={350}
          responsive={false}
          animate={{
            duration: 2000,
            onLoad: { duration: 500 }
          }}
          domainPadding={{ x: 0 }} >
          <VictoryBar
            x='value'
            y='percentage'
            domain={{ y: [0, 100] }}
            dataComponent={
              <Bar />
            }
            labels={(value) => value.votes}
            labelComponent={<VictoryTooltip />}
            style={{ data: { fill: '#64476e' } }}
            data={negative} />
          <VictoryAxis
            style={{ axis: { visibility: 'hidden' }, tickLabels: { fontSize: 14 }, axisLabel: { fontSize: 24, padding: 100 } }}
            tickFormat={(t) => fillFormatLabel(t)}
            label={t('proposal-result.middle-against')} />
        </VictoryChart>
      </div>
      <div className='col-xs-12 col-md-6'>
        <VictoryChart
          height={350}
          width={350}
          animate={{
            duration: 2000,
            onLoad: { duration: 500 }
          }}
          domainPadding={{ x: 0 }} >
          <VictoryBar
            x='value'
            y='percentage'
            domain={{ y: [0, 100] }}
            dataComponent={
              <Bar />
            }
            labels={(value) => value.votes}
            labelComponent={<VictoryTooltip />}
            style={{ data: { fill: '#3e96d4' } }}
            data={positive} />
          <VictoryAxis
            style={{ axis: { visibility: 'hidden' }, tickLabels: { fontSize: 14 }, axisLabel: { fontSize: 24, padding: 100 } }}
            tickFormat={(t) => fillFormatLabel(t)}
            label={t('proposal-result.middle-support')} />
        </VictoryChart>
      </div>
    </div>
  )
}

export default userConnector(Slider)
