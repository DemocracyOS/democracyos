import React, {Component} from 'react'
import {browserHistory} from 'react-router'
import userConnector from 'lib/site/connectors/user'

export default function RestrictNotLoggedFactory (WrappedComponent) {
  class RestrictNotLogged extends Component {
    static displayName = `RestrictNotLogged(${getDisplayName(WrappedComponent)})`

    componentWillReceiveProps (props) {
      if (props.user.state.fulfilled) browserHistory.push('/')
    }

    render () {
      return <WrappedComponent {...this.props} />
    }
  }
  
  return userConnector(RestrictNotLogged)
}

function getDisplayName (WrappedComponent) {
  return WrappedComponent.displayName ||
    WrappedComponent.name ||
    'Component'
}
