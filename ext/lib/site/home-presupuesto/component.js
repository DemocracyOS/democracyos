import React, {Component} from 'react'
import {Link} from 'react-router'
import t from 't-component'
import user from 'lib/site/user/user'
import userConnector from 'lib/site/connectors/user'

const distritos = [
  {title: 'Centro', name: 'centro'},
  {title: 'Norte', name: 'norte'},
  {title: 'Noroeste', name: 'noroeste'},
  {title: 'Oeste', name: 'oeste'},
  {title: 'Sudoeste', name: 'sudoeste'},
  {title: 'Sur', name: 'sur'}
]

class HomePresupuesto extends Component {
  constructor (props) {
    super(props)

    this.state = {
      distrito: 'centro'
    }
  }

  render () {
    return (
      <div className='ext-home-presupuesto'>
        <div className='cover'>
          <div className='container'>
            <h1>Votá los proyectos<br/>que querés ver en tu barrio</h1>
            <label>Elegí tu distrito para ver los proyectos:</label>
            <div className='distrito-filter'>
              {distritos.map((d) => {
                const btnStyle = d.name === this.state.distrito ?
                  'btn-primary' :
                  'btn-outline-primary'
                return (
                  <button
                    type='button'
                    key={d.name}
                    className={`btn ${btnStyle}`}>
                    Centro
                  </button>
                )
              })}
            </div>
          </div>
        </div>
        {this.props.user.state.fulfilled && <VotingModule />}
      </div>
    )
  }
}

export default userConnector(HomePresupuesto)

class VotingModule extends Component {
  constructor (props) {
    super(props)

    this.state = {
      loading: false,
      canVote: null,
      message: '',
      error: ''
    }
  }

  componentWillMount () {
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
        error: t('modals.error.default')
      })
    })
  }

  render () {
    if (this.state.loading) return null

    if (this.state.error) {
      return (
        <div className='alert alert-danger error' role='alert'>
          {this.state.error}
        </div>
      )
    }

    return (
      <div>
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
