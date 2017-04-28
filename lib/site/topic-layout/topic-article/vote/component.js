import React, { Component } from 'react'
import { Link } from 'react-router'
import Chart from 'chart.js'
import t from 't-component'
import topicStore from 'lib/stores/topic-store/topic-store'
import userConnector from 'lib/site/connectors/user'
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
    let newState = this.prepareState(this.props)
    this.setState(newState)
  }

  componentWillReceiveProps (props) {
    let newState = this.prepareState(props)
    this.setState(newState)
  }

  prepareState ({ votes }) {
    let voted = false
    let votedValue = null
    let alertVote = null

    if (this.props.user.state.fulfilled) {
      const user = this.props.user.state.value

      Object.keys(votes).forEach((votesOpt) => {
        if (!votes[votesOpt].length) return

        const ownVote = votes[votesOpt].find((v) => {
          return typeof v === 'string' ? v === user.id : v.id === user.id
        })

        if (ownVote) {
          voted = true
          votedValue = votesOpt
          alertVote = this.options[votedValue].alert
        }
      })
    }

    let alert
    if (alertVote) {
      alert = {
        className: alertVote.className,
        text: alertVote.text,
        hide: false
      }
    } else {
      alert = {
        className: '',
        text: '',
        hide: true
      }
    }

    return {
      voted: voted,
      votes: votes,
      alert: alert
    }
  }

  handleVote = (e) => {
    if (!this.props.user.state.fulfilled) return

    let voteValue = e.currentTarget.getAttribute('data-vote')
    topicStore
      .vote(this.props.id, voteValue)
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

  handleChangeVote = () => {
    this.setState({ changingVote: true })
  }

  resultChartDidMount = (resultChart) => {
    if (!resultChart) return
    let votes = this.state.votes
    let votesTotal = Object.keys(votes)
      .reduce((a, b) => a + votes[b].length, 0)
    let data = []

    if (votesTotal) {
      data.push({
        value: votes.positive.length,
        color: '#a4cb53',
        label: t('proposal-options.yea'),
        labelColor: 'white',
        labelAlign: 'center'
      })
      data.push({
        value: votes.neutral.length,
        color: '#666666',
        label: t('proposal-options.abstain'),
        labelColor: 'white',
        labelAlign: 'center'
      })
      data.push({
        value: votes.negative.length,
        color: '#d95e59',
        label: t('proposal-options.nay'),
        labelColor: 'white',
        labelAlign: 'center'
      })

      new Chart(resultChart.getContext('2d'))
        .Pie(data, { animation: false }) // eslint-disable-line new-cap
    }
  }

  render () {
    const votes = this.state.votes

    const votesTotal = Object.keys(votes).reduce(function (a, b) {
      return a + votes[b].length
    }, 0)

    const closed = this.props.closed

    return (
      <div className='proposal-options topic-article-content'>
        {
          !this.state.alert.hide &&
          !this.state.changingVote &&
          (
            <div
              className={this.state.alert.className + ' alert'}>
              {this.state.alert.text && t(this.state.alert.text)}.
            </div>
          )
        }
        {
          !closed &&
          this.state.voted &&
          !this.state.changingVote && (
            <button
              className='meta-item change-vote'
              onClick={this.handleChangeVote}>
              <i className='icon-refresh' />
              <small>{t('proposal-options.change-vote')}.</small>
            </button>
          )
        }
        {
          closed && votesTotal > 0 && (
            <ResultBox
              votes={votes}
              votesTotal={votesTotal}
              options={this.options}
              resultChartDidMount={this.resultChartDidMount} />
          )
        }
        {
          !closed && (!this.state.voted || this.state.changingVote) && (
            <VoteBox options={this.options} onVote={this.handleVote} />
          )
        }
        <div className='votes-cast'>
          <em className='text-muted'>
            {t('proposal-options.votes-cast', { num: votesTotal })}
          </em>
        </div>
        {
          !this.props.user.state.fulfilled && (
            <p className='text-mute overlay-vote'>
              <span className='text'>
                {t('proposal-options.must-be-signed-in') + '. '}
                <Link
                  to={{
                    pathname: '/signin',
                    query: { ref: window.location.pathname }
                  }}>
                  {t('signin.login')}
                </Link>
                <span>&nbsp;{t('common.or')}&nbsp;</span>
                <Link to='/signup'>
                  {t('signin.signup')}
                </Link>.
              </span>
            </p>
          )
        }
        {
          this.props.user.state.fulfilled &&
          !this.props.canVoteAndComment && (
            <p className='text-mute overlay-vote'>
              <span className='icon-lock' />
              <span className='text'>
                {t('privileges-alert.not-can-vote-and-comment')}
              </span>
            </p>
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

              let width = votesTotal
                ? (votesByType.length / votesTotal) * 100
                : 0
              width = Math.round(width * 100) / 100

              let s = votesByType.length === 1 ? '' : 's'

              return (
                <div className={option.className + ' votes-results'} key={v}>
                  <h5>{t(option.text)}</h5>
                  <span className='percent'>{width}%</span>
                  <span className='votes'>
                    {votesByType.length}
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

function VoteBox (props) {
  const options = props.options
  const handleVote = props.onVote

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
                  href='#'
                  className={'vote-option ' + option.button.className}
                  data-vote={o}
                  onClick={handleVote}
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
