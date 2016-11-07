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
      for (var i = 0; i < (9 - tweets.length); i++) {
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
            <div
            className='tw-link'>
            @MuniRosario <span>|  273 K</span>
            </div>
            <div
            className='fb-link'>
            @MunicipalidadRosario <span>|  70 K</span>
            </div>
            <div
            className='yt-link'>
            @MuniRosario <span>|  1.512 K</span>
            </div>
          </div>
        </div>
        {
          tweets.map((twt, key) => {
            const imageUrl = twt.entities.media[0].media_url || ''
            return (
              <div
                key={key}
                className={
                  'tweet-box tweet-box-sm' +
                  (
                    twt.entities.media[0].media_url
                      ? ''
                      : ' placeholder'
                  )
                }
                style={{
                  order: (key > 3) ? (key + 3) : (key + 2)
                }}
                >
                  <div className='tweet-bird'></div>
                  <div
                    className='tweet-content'
                    style={{
                      backgroundImage: 'url(' + imageUrl + ')'
                    }}>
                  </div>
              </div>
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
