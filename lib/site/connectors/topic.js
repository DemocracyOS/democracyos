import bus from 'bus'
import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import topicStore from 'lib/stores/topic-store/topic-store'

export default function TopicConnectorFactory (WrappedComponent) {
  return class TopicConnector extends Component {
    static displayName = `TopicConnector(${getDisplayName(WrappedComponent)})`

    static WrappedComponent = WrappedComponent

    state = {
      topic: null
    }

    constructor (props) {
      super(props)

      if (!props.params.id) {
        throw new Error('TopicConnector intented to be used on Topic View')
      }
    }

    componentWillReceiveProps (nextProps) {
      const { id } = nextProps.params
      this.fetchTopic(id)
    }

    componentDidMount () {
      const { id } = this.props.params
      bus.on(`topic-store:update:${id}`, this.handleTopicUpdate)
      bus.on(`topic-store:remove:${id}`, this.handleTopicRemove)
      this.fetchTopic(id)
    }

    componentWillUnmount () {
      const id = this.props.params.id
      bus.off(`topic-store:update:${id}`, this.handleTopicUpdate)
      bus.off(`topic-store:remove:${id}`, this.handleTopicRemove)
    }

    handleTopicUpdate = (topic) => {
      this.setState({ topic })
    }

    handleTopicRemove = () => {
      this.setState({ topic: null })
      this.fetchTopic(this.props.params.id)
    }

    fetchTopic = (id) => {
      topicStore.findOne(id)
        .then(this.handleTopicUpdate)
        .catch((err) => {
          if (err.status === 404) return browserHistory.push('/404')
          if (err.status === 401) return browserHistory.push('/401')
          throw err
        })
    }

    render () {
      return <WrappedComponent topic={this.state.topic} {...this.props} />
    }
  }
}

function getDisplayName (WrappedComponent) {
  return WrappedComponent.displayName ||
    WrappedComponent.name ||
    'Component'
}
