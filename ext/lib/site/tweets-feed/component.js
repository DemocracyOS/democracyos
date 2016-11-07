import React, {Component} from 'react'
import { connect } from 'react-refetch'

class TweetsFeed extends Component {
  render () {
    const { tweetsFetch } = this.props
    let tweets = null
    if (tweetsFetch.fulfilled) {
      tweets = tweetsFetch.value.results.tweets
    }
    console.log(tweets)
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
          tweets &&
          tweets.map((twt, key) => {
            console.log(typeof twt.entities.media)
            if (typeof twt.entities.media === 'undefined') return null
            return (
              <div
                key={key}
                className='tweet-box tweet-box-sm'
                >
                  <div
                    className='tweet-content'
                    style={{
                      backgroundImage: 'url(' + twt.entities.media[0].media_url + ')'
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
