import React, { Component } from 'react'
import user from 'lib/site/user/user'

export default function UserConnectorFactory (WrappedComponent) {
  return class UserConnector extends Component {
    static displayName = `UserConnector(${getDisplayName(WrappedComponent)})`

    static defaultProps = { user }

    constructor (props) {
      super(props)

      this.props.user.fetch()
    }

    componentWillMount () {
      user.onChange(this.handleUserStateChange)
    }

    componentWillUnmount () {
      user.offChange(this.handleUserStateChange)
    }

    handleUserStateChange = () => {
      this.forceUpdate()
    }

    render () {
      return <WrappedComponent {...this.props} />
    }
  }
}

function getDisplayName (WrappedComponent) {
  return WrappedComponent.displayName ||
    WrappedComponent.name ||
    'Component'
}
