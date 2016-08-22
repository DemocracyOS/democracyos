import React, {Component} from 'react'
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
      showVoteButtons: true,
      showNotLogged: false
    }

    this.vote = this.vote.bind(this)
  }

  componentWillReceiveProps (props) {
    let votes = {
      positive: props.upvotes || [],
      negative: props.downvotes || [],
      neutral: props.abstentions || []
    }

    let voted = false
    let votedValue = null
    let alertVote = null
    Object.keys(votes)
      .forEach(function (votesOpt) {
        if (~votes[votesOpt].indexOf(user.id)) {
          voted = true
          votedValue = votesOpt
          alertVote = this.options[votedValue].alert
        }
      })

    let alert
    let showVoteButtons
    if (alertVote) {
      alert = {
        className: alertVote.className,
        text: alertVote.text,
        hide: false
      }
      showVoteButtons = false
    } else {
      alert = {
        className: '',
        text: '',
        hide: true
      }
      showVoteButtons = true
    }

    this.setState({
      votes: votes,
      alert: alert,
      voted: voted,
      showVoteButtons: showVoteButtons
    })
  }

  vote (e) {
    if (!user.logged()) {
      this.setState({showNotLogged: true})
      return
    }

    let voteValue = e.currentTarget.getAttribute('data-vote')
    topicStore
      .vote(this.props.id, voteValue)
      .then((res) => {
        console.log('done vote', res)
        this.setState({
          alert: {
            className: this.options[voteValue].className,
            text: this.options[voteValue].text,
            hide: false
          },
          voted: true,
          showVoteButtons: false
        })
      })
      .catch((err) => {
        this.setState({
          alert: {
            className: 'alert-warning',
            text: 'proposal-options.error.voting',
            hide: false
          },
          voted: false,
          showVoteButtons: true
        })
      })
  }

  render () {
    let votes = this.state.votes
    let votesTotal = Object.keys(votes)
      .reduce(function (a, b) {
        return a + votes[b].length
      }, 0)

    let closed = this.props.closed

    let voteBox = (
      <div className='results-box row clearfix'>
        <p className={votesTotal.length ? 'hide' : 'alert alert-info'}>
          <label>{t('proposal-options.no-votes-cast')}</label>
        </p>
        <div className={votesTotal.length ? 'results-chart col-sm-6' : 'hide'}>
          <canvas id='results-chart' width='220' height='220'></canvas>
        </div>
        <div className={votesTotal.length ? 'results-summary col-sm-6' : 'hide'}>
          {
            Object.keys(this.state.votes)
              .map((v) => {
                let votes = this.state.votes[v]
                if (votes.length) {
                  let width = votesTotal.length
                    ? (votes.length / votesTotal.length) * 100
                    : 0
                  width = Math.round(width * 100) / 100
                  let s = votes.length === 1 ? '' : 's'
                  return (
                    <div className='votes-neutral votes-results' key={v}>
                      <h5>{t('proposal-options.abstain')}</h5>
                        <span className='percent'>{width}%</span>
                        <span className='votes'>
                          {votes.length}
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
    
    let resultBox = (
      <div className='vote-box'>
        <a
          href='#'
          className={this.state.voted ? 'meta-item change-vote' : 'hide'}>
          <i className='icon-refresh'></i>
          <small>{t('proposal-options.change-vote')}.</small>
        </a>
        <div className={this.state.showVoteButtons ? 'vote-options' : 'hide'}>
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
    console.log('votos total', votesTotal)

    return (
      <div className='proposal-options'>
        <div
          className={this.state.alert.hide ? 'hide' : this.state.alert.className + ' alert'}>
          {t(this.state.alert.text)}.
        </div>
        {closed ? voteBox : resultBox}
        <div className='votes-cast'>
          <em className='text-muted'>
            {t('proposal-options.votes-cast', { num: votesTotal })}
          </em>
        </div>
        <p className={this.state.showNotLogged ? 'text-mute overlay-vote' : 'hide'}>
          {t('proposal-options.must-be-signed-in') + '. '}
          <a href='/signin'>{t('signin.login')}</a>
          <span>&nbsp;{t('common.or')}&nbsp;</span>
          <a href={'/signup?reference=' + this.props.url}>{t('signin.signup')}</a>.
        </p>
      </div>
    )
  }
}
