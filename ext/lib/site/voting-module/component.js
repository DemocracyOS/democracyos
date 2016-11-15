import React, {Component} from 'react'
import {Link} from 'react-router'
import user from 'lib/site/user/user'
import userConnector from 'lib/site/connectors/user'

/*

mensaje.estado.0 = Invocaci&oacute;n incorrecta.
mensaje.estado.1 = Se encuentra habilitado para votar.
mensaje.estado.2 = Ya participaste con este documento.
mensaje.estado.3 = Lo sentimos, tus datos no se encuentran en el padr&oacute;n de votantes habilitados, \
pod&eacute;s dirigirte a tu Centro Municipal de Distrito o consultar a: <a href='yoparticipo@rosario.gob.ar'>yoparticipo@rosario.gob.ar</a>.
mensaje.estado.10 = El período de votación no ha comenzado todavía.
#El per&iacute;odo de votaci&oacute;n se inicia el 6/11 a las 8:00hs.
mensaje.estado.11 = Se encuentra en el período de votación.
mensaje.estado.12 = El período de votación ha finalizado.

 */

class VotingModule extends Component {
  constructor (props) {
    super(props)

    this.state = {
      loading: false,
      message: '',
      error: null
    }
  }

  componentWillReceiveProps (props) {
    if (props.user.state.pending) {
      return this.setState({loading: true})
    }

    if (props.user.state.rejected) {
      return this.setState({
        loading: false,
        error: null,
        message: (
          <Link
            to={{pathname: '/signin', query: {ref: location.pathname}}}
            className='btn btn-lg btn-block btn-primary'>
            Ingresar y Votar
          </Link>
        )
      })
    }

    if (!user.profileIsComplete()) {
      return this.setState({
        loading: false,
        error: null,
        message: (
          <Link
            to={{pathname: '/signup/complete', query: {ref: location.pathname}}}
            className='btn btn-lg btn-block btn-primary'>
            Votar
          </Link>
        )
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
      const codigo = body.results.codigo_mensaje

      if (!codigo) {
        const err = new Error('Código inválido.')
        err.body = body
        throw err
      }

      let msg

      if (codigo === 1 || codigo === 11) {
        msg = (
          <Link
            to='/ext/api/participatory-budget/vote'
            className='btn btn-lg btn-block btn-primary'>
            Votar
          </Link>
        )
      } else if (codigo === 2) {
        msg = (
          <div className='voting-success' role='alert'>
            <h1>¡Gracias por tu Voto!</h1>
            <span>Compartilo con tus vecinos</span>
            <div className='social-links'>
              <a href='#' className='fb'></a>
              <a href='#' className='tw'></a>
              <a href='#' className='msj'></a>
            </div>
          </div>
        )
      } else if (codigo === 3) {
        msg = (
          <div className='alert alert-info' role='alert'>
            Lo sentimos, tus datos no se encuentran en el padrón de votantes habilitados. Podés dirigirte a tu Centro Municipal de Distrito o consultar a: <a href='mailto:yoparticipo@rosario.gob.ar'>yoparticipo@rosario.gob.ar</a>.
          </div>
        )
      } else {
        console.log(body)
        msg = (
          <Link
            to='/ext/api/participatory-budget/vote'
            className='btn btn-lg btn-block btn-primary'>
            Votar
          </Link>
        )
      }

      this.setState({
        loading: false,
        error: null,
        message: msg
      })
    }).catch((err) => {
      console.error(err)
      this.setState({
        loading: false,
        message: null,
        error: (
          <div className='alert alert-danger error' role='alert'>
            ¡Lo sentimos! Hubo un error verificando tu perfil de votación. Volvé a probar mas tarde o contactanos en <a href='mailto:participa@rosario.gob.ar'>participa@rosario.gob.ar</a>
          </div>
        )
      })
    })
  }

  render () {
    if (this.state.loading) return null
    if (!this.state.error && !this.state.message) return null

    return (
      <div className='ext-voting-module'>
        {this.state.error}
        {this.state.message}
      </div>
    )
  }
}

export default userConnector(VotingModule)
