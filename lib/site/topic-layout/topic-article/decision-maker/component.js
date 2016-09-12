import React, {Component} from 'react'
import { Link } from 'react-router'
import Chart from 'chart.js'
import user from 'lib/user/user'
import t from 't-component'
import topicStore from 'lib/stores/topic-store/topic-store'

export default class DecisionMaker extends Component {
  constructor (props) {
    super(props)
    this.options = {
      positive: {
        alert: {
          className: 'alert-success',
          text: 'proposal-options.voted-yea'
        },
        button: {
          className: 'vote-yes',
          text: 'proposal-options.yea',
          icon: 'thumbs-up-1'
        }
      },
      neutral: {
        alert: {
          className: 'alert-info',
          text: 'proposal-options.voted-abstained'
        },
        button: {
          className: 'vote-abstain',
          text: 'proposal-options.abstain',
          icon: 'pause'
        }
      },
      negative: {
        alert: {
          className: 'alert-danger',
          text: 'proposal-options.voted-nay'
        },
        button: {
          className: 'vote-no',
          text: 'proposal-options.nay',
          icon: 'thumbs-up-1'
        }
      }
    }

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
      changingVote: false,
      showNotLogged: false
    }

    this.vote = this.vote.bind(this)
    this.changeVote = this.changeVote.bind(this)
    this.resultChartDidMount = this.resultChartDidMount.bind(this)
    this.onUserStateChange = this.onUserStateChange.bind(this)
  }

  componentWillMount () {
    let newState = this.prepareState(this.props.votes)
    this.setState(newState)
    user.on('loaded', this.onUserStateChange)
    user.on('unloaded', this.onUserStateChange)
  }

  componentWillUnmount () {
    user.off('loaded', this.onUserStateChange)
    user.off('unloaded', this.onUserStateChange)
  }

  componentWillReceiveProps (props) {
    let newState = this.prepareState(props.votes)
    this.setState(newState)
  }

  onUserStateChange () {
    let newState = this.prepareState(this.props.votes)
    this.setState(newState)
  }

  prepareState (votes) {
    let voted = false
    let votedValue = null
    let alertVote = null
    if (user.logged()) {
      Object.keys(votes)
        .forEach((votesOpt) => {
          if (~votes[votesOpt].indexOf(user.id)) {
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

  vote (e) {
    if (!user.logged()) {
      this.setState({showNotLogged: true})
      return
    }

    let voteValue = e.currentTarget.getAttribute('data-vote')
    topicStore
      .vote(this.props.id, voteValue)
      .then(res => {
        this.props.resetTopic(this.props.id)
      })
      .catch(err => {
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

  changeVote () {
    this.setState({changingVote: true})
  }

  resultChartDidMount (resultChart) {
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
        .Pie(data, { animation: false })
    }
  }

  render () {
    let votes = this.state.votes
    let votesTotal = Object.keys(votes)
      .reduce(function (a, b) {
        return a + votes[b].length
      }, 0)

    let closed = this.props.closed

    let resultBox = (
      <div className='results-box row clearfix'>
        <p className={votesTotal ? 'hide' : 'alert alert-info'}>
          <label>{t('proposal-options.no-votes-cast') + votesTotal}</label>
        </p>
        <div className={votesTotal ? 'results-chart col-sm-6' : 'hide'}>
          <canvas
            id='results-chart'
            width='220'
            height='220'
            ref={this.resultChartDidMount}>
          </canvas>
        </div>
        <div className={votesTotal ? 'results-summary col-sm-6' : 'hide'}>
          {
            Object.keys(votes)
              .map((v) => {
                let votesByType = votes[v]
                let options = this.options[v].button
                if (votesByType.length) {
                  let width = votesTotal
                    ? (votesByType.length / votesTotal) * 100
                    : 0
                  width = Math.round(width * 100) / 100
                  let s = votesByType.length === 1 ? '' : 's'
                  return (
                    <div className={options.className + ' votes-results'} key={v}>
                      <h5>{t(options.text)}</h5>
                      <span className='percent'>{width}%</span>
                      <span className='votes'>
                        {votesByType.length}
                        {t('proposal-options.vote-item') + s}
                      </span>
                    </div>
                  )
                } else {
                  return null
                }
              })
            }
        </div>
      </div>
    )

    let voteBox = (
      <div className='vote-box'>
        <a
          href='#'
          className={this.state.voted && !this.state.changingVote ? 'meta-item change-vote' : 'hide'}
          onClick={this.changeVote}>
          <i className='icon-refresh'></i>
          <small>{t('proposal-options.change-vote')}.</small>
        </a>
        <div className={!this.state.voted || this.state.changingVote ? 'vote-options' : 'hide'}>
          <h5>{t('proposal-options.vote')}</h5>
          <div className='direct-vote'>
            {
              Object.keys(this.options)
                .map((o) => {
                  let option = this.options[o]
                  return (
                    <a
                      href='#'
                      className={'vote-option ' + option.button.className}
                      data-vote={o}
                      onClick={this.vote}
                      key={o}>
                      <i className={'flaticon solid ' + option.button.icon}></i>
                      <span>{t(option.button.text)}</span>
                    </a>
                  )
                })
            }
          </div>
        </div>
      </div>
    )

    return (
      <div className='proposal-options'>
        <div
          className={this.state.alert.hide ? 'hide' : this.state.alert.className + ' alert'}>
          {this.state.alert.text && t(this.state.alert.text)}.
        </div>
        {closed ? resultBox : voteBox}
        <div className='votes-cast'>
          <em className='text-muted'>
            {t('proposal-options.votes-cast', { num: votesTotal })}
          </em>
        </div>
        <p className={this.state.showNotLogged ? 'text-mute overlay-vote' : 'hide'}>
          <span className='text'>
            {t('proposal-options.must-be-signed-in') + '. '}
            <Link
              to={
                {
                  pathname: '/signin',
                  query: {ref: window.location.pathname}
                }
              }>
              {t('signin.login')}
            </Link>
            <span>&nbsp;{t('common.or')}&nbsp;</span>
            <Link to='/signup'>
              {t('signin.signup')}
            </Link>.
          </span>
        </p>
        <p className={this.props.cantVote ? 'text-mute overlay-vote' : 'hide'}>
          <span className='icon-lock'></span>
          <span className='text'>
            {t('privileges-alert.not-can-vote-and-comment')}
          </span>
        </p>
      </div>
    )
  }
}
