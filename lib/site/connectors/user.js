import React, {Component} from 'react'
import {PromiseState} from 'react-refetch'

const user = {
  _state: PromiseState.create(),
  stateHandlers: [],

  get state () {
    if (this._state.pending) this.fetch()
    return this._state
  },

  set state (promiseState) {
    this._state = promiseState
    this.stateHandlers.forEach((cb) => cb(promiseState))
  },

  addStateHandler (cb) {
    this.stateHandlers.push(cb)
  },

  removeStateHandler (cb) {
    const i = this.stateHandlers.indexOf(cb)
    if (i !== -1) return this.stateHandlers.splice(i, 1)
  },

  update (attrs) {
    if (Object.freeze) Object.freeze(attrs)
    this.state = PromiseState.resolve(attrs)
  },

  fetching: false,
  fetch () {
    if (this.fetching) return
    this.fetching = true
    return fetch('/api/user/me', {
      credentials: 'same-origin',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    }).then((res) => {
      this.fetching = false
      if (res.status >= 200 && res.status < 300) {
        return res.json()
      }

      const err = new Error(res.statusText)
      err.res = res
      throw err
    }).then((attrs) => {
      this.update(attrs)
    }).catch((err) => {
      if (err.res.status === 403) {
        this.state = PromiseState.reject('Logged out', err)
      } else {
        this.state = PromiseState.reject('Request error', err)
        throw err
      }
    })
  },

  logout () {
    fetch('/api/signin', {
      method: 'DELETE',
      credentials: 'same-origin',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })

    this.state = PromiseState.reject('Logged out')
  }
}

Object.keys(user).forEach((k) => {
  if (typeof user[k] === 'function') user[k] = user[k].bind(user)
})

export default function UserConnectorFactory (WrappedComponent) {
  return class UserConnector extends Component {
    static displayName = `UserConnector(${getDisplayName(WrappedComponent)})`

    static defaultProps = {
      handleUserLogout: user.logout,
      userUpdate: user.update
    }

    constructor (props) {
      super(props)

      this.state = {
        userFetch: user.state
      }
    }

    componentWillMount () {
      user.addStateHandler(this.updateUserState)
    }

    componentWillUnmount () {
      user.removeStateHandler(this.updateUserState)
    }

    updateUserState = (nextState) => {
      this.setState({
        userFetch: nextState
      })
    }

    render () {
      const props = Object.assign({}, this.state, this.props)
      return <WrappedComponent {...props} />
    }
  }
}

function getDisplayName (WrappedComponent) {
  return WrappedComponent.displayName ||
    WrappedComponent.name ||
    'Component'
}
