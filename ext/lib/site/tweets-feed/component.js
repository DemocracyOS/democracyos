import React, { Component } from 'react'
import { connect } from 'react-refetch'

class TweetsFeed extends Component {
  state = {
    tweets: []
  }

  componentDidMount () {
    this.setState({
      tweets: this.parseTweetsFromProps(this.props)
    })
  }

  componentWillReceiveProps (props) {
    this.setState({
      tweets: this.parseTweetsFromProps(props)
    })
  }

  parseTweetsFromProps (props) {
    const { tweetsFetch } = props
    const tweets = tweetsFetch.fulfilled ? tweetsFetch.value.slice(0) : []

    while (tweets.length < 6) tweets.push(null)

    return tweets
  }

  render () {
    return (
      <div className='tweets-box'>
        <div className='tweet-box tweet-box-lg tweets-logo'>
          <div className='tweet-content'>
            <span>#YoVotoPorMiBarrio</span>
          </div>
        </div>
        <div className='tweet-box tweet-box-lg tweets-links'>
          <div className='tweet-content'>
            <a
              href='https://twitter.com/RParticipa'
              target='_blank'
              rel='noopener noreferrer'
              className='tw-link'>
              @RParticipa
            </a>
            <a
              href='https://facebook.com/RosarioParticipa'
              target='_blank'
              rel='noopener noreferrer'
              className='fb-link'>
              /RosarioParticipa
            </a>
            <a
              href='https://youtube.com/MuniRosario'
              target='_blank'
              rel='noopener noreferrer'
              className='yt-link'>
              MuniRosario
            </a>
          </div>
        </div>
        {this.state.tweets.map((twt, key) => {
          return (
            <a
              key={key}
              className={`tweet-box tweet-box-sm${twt ? '' : ' placeholder'}`}
              target='_blank'
              title={twt && twt.text}
              href={twt ? twt.url : '#'}>
              <div className='tweet-bird' />
              <div
                className='tweet-content'
                style={twt && ({ backgroundImage: `url(${twt.image})` })} />
            </a>
          )
        })}
      </div>
    )
  }
}

export default connect((props) => {
  // Temporarily hard-code results, twitter api is
  // not bringing photos for all tweets
  // https://github.com/RosarioCiudad/democracyos/issues/89
  // return {
  //   tweetsFetch: {
  //     url: '/tweets',
  //     then: (res) => ({
  //       value: res.results.tweets.map((twt) => {
  //         const media = twt.entities.media && twt.entities.media[0]
  //         if (!media || !media.url) return false
  //
  //         return {
  //           url: media.url,
  //           image: media.media_url_https,
  //           text: twt.text
  //         }
  //       }).filter((twt) => twt)
  //     })
  //   }
  // }
  return {
    tweetsFetch: {
      value: require('./tweets.json')
    }
  }
})(TweetsFeed)
