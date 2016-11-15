import React, {Component} from 'react'
import {Link} from 'react-router'
import user from 'lib/site/user/user'
import userConnector from 'lib/site/connectors/user'

class VotingModule extends Component {
  constructor (props) {
    super(props)

    this.state = {
      loading: false,
      canVote: null,
      message: '',
      error: ''
    }
  }

  componentWillReceiveProps (nextProps) {
    if (!nextProps.user.state.fulfilled) {
      this.setState({loading: true})
      return null
    }

    if (!user.profileIsComplete()) {
      return this.setState({
        canVote: false,
        message: 'Para poder votar debes completar la información de tu perfil haciendo <a href="/signup/complete">click aqui</a>.'
      })
    }

    this.setState({loading: true})

    fetch('/ext/api/participatory-budget/status', {
      credentials: 'same-origin',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    }).then((res) => {
      if (res.status >= 200 && res.status < 300) return res.json()

      const err = new Error(res.statusText)
      err.res = res
      throw err
    }).then((body) => {
      this.setState({
        loading: false,
        error: '',
        message: body.results.mensaje_aclaratorio,
        canVote: body.results.puede_votar
      })
    }).catch((err) => {
      console.error(err)
      this.setState({
        loading: false,
        error: '¡Lo sentimos! Hubo un error verificando el estado de tu votación.'
      })
    })
  }

  render () {
    if (!this.props.user.state.fulfilled) return null
    if (this.state.loading) return null

    if (this.state.error) {
      return (
        <div className='ext-voting-module'>
          <div className='alert alert-danger error' role='alert'>
            {this.state.error}
          </div>
        </div>
      )
    }

    return (
      <div className='ext-voting-module'>
        {this.state.message && (
          <div
            className='alert alert-info error'
            role='alert'
            dangerouslySetInnerHTML={{__html: this.state.message}} />
        )}
        {this.state.canVote && (
          <Link
            className='btn btn-primary'
            to='/ext/api/participatory-budget/vote'>
            Votar
          </Link>
        )}
      </div>
    )
  }
}

export default userConnector(VotingModule)
