import React, { Component } from 'react'
import InputRange from 'react-input-range'
import { VictoryChart, VictoryBar, Bar, VictoryAxis, VictoryTooltip } from 'victory'
import t from 't-component'
import userConnector from 'lib/site/connectors/user'
import topicStore from 'lib/stores/topic-store/topic-store'

class Slider extends Component {
  constructor (props) {
    super(props)
    this.state = {
      value: this.props.topic.voted ? Number(this.props.topic.voted) : 0,
      voted: this.props.topic.voted !== false
    }

    this.handleVote = this.handleVote.bind(this)
  }

  handleVote (e) {
    if (!this.props.user.state.fulfilled) return

    const { value } = this.state
    topicStore
      .vote(this.props.topic.id, value.toString())
      .then(() => {
        this.setState({
          voted: true
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
    const { value, voted } = this.state
    const { topic, user } = this.props

    const votesTotal = topic.action.count

    return (
      <div className='topics-slider'>
        {
          (!(topic.closed || topic.voted)) &&
            <div>
              <InputRange
                maxValue={100}
                minValue={-100}
                step={25}
                value={value}
                formatLabel={(value) => `${Math.abs(value)}%`}
                disabled={!!topic.voted || !!voted}
                onChange={(value) => this.setState({ value })} />
              <div className='row row-slider-labels'>
                <div className='col-xs-6'>
                  <p>{t('proposal-result.against')}</p>
                </div>
                <div className='col-xs-6'>
                  <p className='text-xs-right'>{t('proposal-result.support')}</p>
                </div>
              </div>
              <VoteBox onVote={this.handleVote} />
            </div>
        }
        {
          (!topic.closed && topic.voted) &&
            <VotedBox num={value} />
        }
        {
          (topic.closed && topic.voted) &&
            <ResultBox
              votesTotals={votesTotal}
              results={topic.action.results} />
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

function VotedBox ({ num }) {
  const text = num > 0
    ? 'proposal-options.voted-positive-percentage'
    : 'proposal-options.voted-negative-percentage'

  return (
    <div className='voted-box'>
      <p>{t('proposal-options.voted')}</p>
      <p>{t(text, { num: Math.abs(num) })}</p>
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
          domainPadding={{ x: 20 }} >
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
            style={{ axis: { visibility: 'hidden' }, tickLabels: { fontSize: 16 }, axisLabel: { fontSize: 24, padding: 50 } }}
            tickFormat={(t) => `${Math.abs(t)}%`}
            label={t('proposal-result.against')} />
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
          domainPadding={{ x: 20 }} >
          <VictoryBar
            x='value'
            y='percentage'
            domain={{ y: [0, 100] }}
            dataComponent={
              <Bar />
            }
            labels={(value) => value.votes}
            labelComponent={<VictoryTooltip/>}
            style={{ data: { fill: '#3e96d4' } }}
            data={positive} />
          <VictoryAxis
            style={{ axis: { visibility: 'hidden' }, tickLabels: { fontSize: 16 }, axisLabel: { fontSize: 24, padding: 50 } }}
            tickFormat={(t) => `${Math.abs(t)}%`}
            label={t('proposal-result.support')} />
        </VictoryChart>
      </div>
    </div>
  )
}

export default userConnector(Slider)
