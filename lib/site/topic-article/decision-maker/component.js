import React, {Component} from 'react'
import user from 'lib/user/user'
import t from 't-component'

export default class DecisionMaker extends Component {
  render () {
    var positives = this.props.upvotes || []
    var negatives = this.props.downvotes || []
    var neutrals = this.props.abstentions || []
    var census = neutrals.concat(negatives).concat(positives) || []

    var closed = this.props.closingAt && +new Date(this.props.closingAt) < Date.now()
    var voted = user && ~census.indexOf(user.id)

    var canVoteContent = null
    if (this.props.canVote && !!user.id) {
      let userVote
      if (~positives.indexOf(user.id)) {
        userVote = (
          <div className='alert alert-success'>
            {t('proposal-options.voted-yea')}.
          </div>
        )
      } else if (~negatives.indexOf(user.id)) {
        userVote = (
          <div className='alert alert-danger'>
            {t('proposal-options.voted-nay')}.
          </div>
        )
      } else if (~neutrals.indexOf(user.id)) {
        userVote = (
          <div className='alert alert-info'>
            {t('proposal-options.voted-abstained')}.
          </div>
        )
      }

      let changeVote = null
      if (voted && !closed) {
        changeVote = (
          <a href='#' className='meta-item change-vote'>
            <i className='icon-refresh'></i>
            <small>{t('proposal-options.change-vote')}.</small>
          </a>
        )
      }

      let voteButtons = null
      if (!voted || !closed) {
        voteButtons = (
          <div className='vote-options'>
            <h5>{t('proposal-options.vote')}</h5>
            <div className='direct-vote'>
              <a href='#' className='vote-option vote-yes' data-proposal={this.props.id}>
                <i className='flaticon solid thumbs-up-1'></i>
                <span>{t('proposal-options.yea')}</span>
              </a>
              <a href='#' className='vote-option vote-abstain' data-proposal={this.props.id}>
                <i className='flaticon solid pause'></i>
                <span>{t('proposal-options.abstain')}</span>
              </a>
              <a href='#' className='vote-option vote-no' data-proposal={this.props.id}>
                <i className='flaticon solid thumbs-up-1'></i>
                <span>{t('proposal-options.nay')}</span>
              </a>
            </div>
          </div>
        )
      }

      let notLogged = null
      if (!user.id) {
        notLogged = (
          <div>
            <p className='text-mute overlay-vote hide'>
              {t('proposal-options.must-be-signed-in') + '. '}
            </p>
            <a href='/signin'>{t('signin.login') + ' ' + t('common.or') + ' '}</a>
            <a href={'/signup?reference=' + this.props.url}>{t('signin.signup')}.</a>
          </div>
        )
      }

      canVoteContent = (
        <div>
          <div className='meta-data'>
            {userVote}
            {changeVote}
          </div>
          {voteButtons}
          {notLogged}
        </div>
      )
    }

    var closedContent = null
    if (closed) {
      let positivesResult = null
      if (positives.length) {
        let width = census.length ? (positives.length / census.length) * 100 : 0
        width = Math.round(width * 100) / 100
        let s = positives.length === 1 ? '' : 's'
        positivesResult = (
          <div className='votes-afirmative votes-results'>
            <h5>{t('proposal-options.yea')}</h5>
            <span className='percent'>{width}%</span>
            <span className='votes'>
              {positives.length}
              {t('proposal-options.vote-item') + s}
            </span>
          </div>

        )
      }

      let negativesResult = null
      if (negatives.length) {
        let width = census.length ? (negatives.length / census.length) * 100 : 0
        width = Math.round(width * 100) / 100
        let s = negatives.length === 1 ? '' : 's'
        negativesResult = (
          <div className='votes-negative votes-results'>
            <h5>{t('proposal-options.nay')}</h5>
              <span className='percent'>{width}%</span>
              <span className='votes'>
                {negatives.length}
                {t('proposal-options.vote-item') + s}
              </span>
          </div>

        )
      }

      let neutralsResult = null
      if (neutrals.length) {
        let width = census.length ? (neutrals.length / census.length) * 100 : 0
        width = Math.round(width * 100) / 100
        let s = neutrals.length === 1 ? '' : 's'
        neutralsResult = (
          <div className='votes-neutral votes-results'>
            <h5>{t('proposal-options.abstain')}</h5>
              <span className='percent'>{width}%</span>
              <span className='votes'>
                {neutrals.length}
                {t('proposal-options.vote-item') + s}
              </span>
          </div>

        )
      }

      closedContent = (
        <div className='results-box row clearfix'>
          <p className={census.length ? 'hide' : 'alert alert-info'}>
            <label>{t('proposal-options.no-votes-cast')}</label>
          </p>
          <div className={census.length ? 'results-chart col-sm-6' : 'hide'}>
            <canvas id='results-chart' width='220' height='220'></canvas>
          </div>
          <div className={census.length ? 'results-summary col-sm-6' : 'hide'}>
            {positivesResult}
            {negativesResult}
            {neutralsResult}
          </div>
        </div>
      )
    }

    return (
      <div className='proposal-options'>
        <div className='vote-box'>
          <div id='voting-error' className='alert alert-warning hide'>
            {t('proposal-options.error.voting')}.
          </div>
          {canVoteContent}
          <div className='votes-cast'>
            <em className='text-muted'>
              {t('proposal-options.votes-cast', { num: census.length || '0' })}
            </em>
          </div>
        </div>
        {closedContent}
      </div>
    )
  }
}
