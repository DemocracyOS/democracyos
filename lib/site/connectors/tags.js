import React, { Component } from 'react'
import forumStore from 'lib/stores/forum-store/forum-store'

export default function TagsConnectorFactory (WrappedComponent) {
  return class TagsConnector extends Component {
    static displayName = `TagsConnector(${getDisplayName(WrappedComponent)})`

    static WrappedComponent = WrappedComponent

    state = {
      tags: null
    }

    componentDidMount () {
      this.fetchTags(this.props.forum && this.props.forum.id)
    }

    componentWillReceiveProps (props) {
      if (props.forum === this.props.forum) return
      this.fetchTags(props.forum && props.forum.id)
    }

    fetchTags = (forumId) => {
      if (!forumId) return this.setState({ tags: null })

      forumStore.findTags(forumId)
        .then((tags) => this.setState({ tags }))
        .catch((err) => { throw err })
    }

    render () {
      return <WrappedComponent tags={this.state.tags} {...this.props} />
    }
  }
}

function getDisplayName (WrappedComponent) {
  return WrappedComponent.displayName ||
    WrappedComponent.name ||
    'Component'
}
