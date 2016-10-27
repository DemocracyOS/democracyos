import React, {Component} from 'react'
import {browserHistory} from 'react-router'
import config from 'lib/config'
import forumStore from 'lib/stores/forum-store/forum-store'
import topicStore from 'lib/stores/topic-store/topic-store'
import userConnector from 'lib/site/connectors/user'
import Sidebar from './sidebar/component'
import TopicArticle from './topic-article/component'

class TopicLayout extends Component {
  constructor (props) {
    super(props)

    this.state = {
      topics: null,
      topic: null,
      forum: null
    }
  }

  onUserStateChange = () => {
    forumStore.clear()
    topicStore.clear()

    this.setState({
      topics: null,
      topic: null,
      forum: null
    }, this.componentDidMount)
  }

  componentWillReceiveProps (nextProps) {
    this.fetchTopic(nextProps.params.id)
  }

  fetchTopic (id) {
    if (this.state.topic && id === this.state.topic.id) return null

    if (this.state.topics) {
      this.setState({
        topic: this.state.topics.find((topic) => {
          return id === topic.id
        })
      })
    } else {
      this.setState({topic: null})
    }

    topicStore.findOne(id)
      .catch(console.error.bind(console))
      .then((topic) => {
        this.setState({topic})
      })
  }

  componentDidMount () {
    let name = this.props.params.forum

    if (!name && !config.multiForum) {
      name = config.defaultForum
    }

    this.fetchTopic(this.props.params.id)

    forumStore.findOneByName(name)
      .catch((err) => {
        if (err.status === 404) window.location = '/404'
      })
      .then((forum) => {
        if (!forum) return

        this.setState({forum})

        topicStore.findAll({forum: forum.id})
          .catch(console.error.bind(console))
          .then((topics) => {
            this.setState({
              topics: topics || []
            })

            if (!this.state.topic) {
              this.setState({
                topic: topics.find((topic) => {
                  return topic.id === this.props.params.id
                })
              })
            }
          })
      })
  }

  render () {
    if (config.visibility === 'hidden' && this.props.userFetch.rejected) {
      browserHistory.push('/signin')
      return null
    }

    return (
      <div id='topic-wrapper'>
        <Sidebar topics={this.state.topics} />
        {
          this.state.forum && this.state.topic && (
            <TopicArticle topic={this.state.topic} forum={this.state.forum} />
          )
        }
      </div>
    )
  }
}

export default userConnector(TopicLayout)
