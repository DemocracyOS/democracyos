import React, {Component} from 'react'
import {browserHistory} from 'react-router'
import user from 'lib/site/user/user'
import userConnector from 'lib/site/connectors/user'
import * as Layout from 'lib/site/layout/component'

const LayoutOriginal = Layout.default

class LayoutOverride extends Component {
  constructor (props) {
    super(props)

    this.state = {
      askedCompleteProfile: props.location.pathname === '/signup/complete'
    }
  }

  componentWillMount () {
    user.onChange(this.handleUserStateChange)
  }

  componentWillUnmount () {
    user.offChange(this.handleUserStateChange)
  }

  componentWillReceiveProps (nextProps) {
    const {user} = nextProps

    if (nextProps.location.pathname !== '/signup/complete') {
      if (user.state.fulfilled && !user.profileIsComplete()) {
        if (!this.state.askedCompleteProfile) {
          this.setState({askedCompleteProfile: true})
          browserHistory.push({
            pathname: '/signup/complete',
            query: {ref: location.pathname}
          })
        }
      }
    } else if (user.state.pending || user.state.rejected) {
      browserHistory.push('/')
    }
  }

  handleUserStateChange = () => {
    this.setState({
      askedCompleteProfile: this.props.location.pathname === '/signup/complete'
    })
  }

  render () {
    if (this.props.user.state.pending) return null

    return <LayoutOriginal {...this.props} />
  }
}

export default userConnector(LayoutOverride)
