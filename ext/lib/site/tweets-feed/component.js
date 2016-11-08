import React, {Component} from 'react'
import { connect } from 'react-refetch'

class TweetsFeed extends Component {
  render () {
    const { tweetsFetch } = this.props
    let tweets = []
    if (tweetsFetch.fulfilled) {
      tweets = tweetsFetch.value.results.tweets
    }
    if (tweets.length < 6) {
      const placeholderCount = 6 - tweets.length
      for (var i = 0; i < placeholderCount; i++) {
        tweets.push({
          entities: {
            media: [{media_url: null}]
          }
        })
      }
    }

    return (
      <div className='tweets-box'>
        <div className='tweet-box tweet-box-lg tweets-logo'>
          <div className='tweet-content'>
            <span className='rosario'>Rosario</span>
            <span className='cerca'>Cerca</span>
          </div>
        </div>
        <div className='tweet-box tweet-box-lg tweets-links'>
          <div className='tweet-content'>
            <a
              href='https://twitter.com/MuniRosario'
              target='_blank'
              className='tw-link'>
            @MuniRosario <span>|  273 K</span>
            </a>
            <a
              href='https://facebook.com/MunicipalidadRosario'
              target='_blank'
              className='fb-link'>
            @MunicipalidadRosario <span>|  70 K</span>
            </a>
            <a
              href='https://youtube.com/MuniRosario'
              target='_blank'
              className='yt-link'>
            @MuniRosario <span>|  1.512 K</span>
            </a>
          </div>
        </div>
        {
          tweets.map((twt, key) => {
            const isPlaceholder = !twt.entities.media[0].media_url
            const imageUrl = twt.entities.media[0].media_url || ''
            return (
              <a
                key={key}
                className={
                  'tweet-box tweet-box-sm' +
                  (
                    isPlaceholder
                      ? ' placeholder'
                      : ''
                  )
                }
                target='_blank'
                href={
                   isPlaceholder
                    ? '#'
                    : 'http://' + twt.entities.media[0].display_url
                  }>
                  <div className='tweet-bird'></div>
                  <div
                    className='tweet-content'
                    style={{
                      backgroundImage: 'url(' + imageUrl + ')'
                    }}>
                  </div>
              </a>
            )
          })
        }
      </div>
    )
  }
}

export default connect(props => {
  return {
    tweetsFetch: '/tweets'
  }
})(TweetsFeed)
