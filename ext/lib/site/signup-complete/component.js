import React, {Component} from 'react'
import {Link, browserHistory} from 'react-router'
import t from 't-component'
import user from 'lib/site/user/user'

export default class SignupComplete extends Component {
  constructor (props) {
    super(props)

    const attrs = user.state.value || {}
    const extra = attrs.extra || {}

    this.state = {
      error: '',
      loading: false,
      cod_doc_disabled: !!extra.cod_doc,
      sexo_disabled: !!extra.sexo,
      nro_doc_disabled: !!extra.nro_doc,
      data: {
        cod_doc: extra.cod_doc || 'DNI',
        sexo: extra.sexo || '',
        nro_doc: extra.nro_doc || null
      }
    }
  }

  handleSuccess = (evt) => {
    evt.preventDefault()
    this.setState({
      error: '',
      loading: true
    })

    user.saveExtraData(this.state.data).then(() => {
      this.setState({
        error: '',
        loading: false
      })

      user.update(Object.assign({}, user.state.value, {
        extra: this.state.data
      }))

      browserHistory.push('/')
    }).catch((err) => {
      this.setState({
        error: 'Hubo un error guardando la información, intente de nuevo por favor.',
        loading: false
      })
    })
  }

  handleInputChange = (evt) => {
    const input = evt.target
    const name = input.getAttribute('name')

    const data = Object.assign({}, this.state.data, {
      [name]: input.value
    })

    this.setState({data})
  }

  handleInputNumberChange = (evt) => {
    const input = evt.target
    const name = input.getAttribute('name')
    const value = input.value.replace(/[^0-9]/g, '')

    const data = Object.assign({}, this.state.data, {
      [name]: value
    })

    this.setState({data})
  }

  render () {
    return (
      <div className='ext-signup-complete'>
        {this.state.loading && <div className='loader'></div>}
        <h3 className='title'>Completá tus datos</h3>
        <p>Para poder votar el Presupuesto Participativo necesitás tener tu perfil completo.</p>
        <form role='form' onSubmit={this.handleSuccess} method='POST'>
          {this.state.error && (
            <div className='alert alert-danger error' role='alert'>
              {t('modals.error.default')}
            </div>
          )}
          <div className='form-group'>
            <label htmlFor='cod_doc'>Tipo de documento</label>
            <div className='form-select-wrapper'>
              <i className='icon-arrow-down'></i>
              <select
                className='form-control custom-select'
                name='cod_doc'
                id='cod_doc'
                value={this.state.data.cod_doc}
                onChange={this.handleInputChange}
                disabled={this.state.loading || this.state.cod_doc_disabled}
                required>
                <option value='DNI'>DNI</option>
                <option value='LC'>LC</option>
                <option value='LE'>LE</option>
              </select>
            </div>
          </div>
          <div className='form-group'>
            <label htmlFor='nro_doc'>Nº de documento</label>
            <input
              className='form-control custom-select'
              type='text'
              name='nro_doc'
              id='nro_doc'
              placeholder='22.333.444'
              maxLength='10'
              onChange={this.handleInputNumberChange}
              value={prettyNumber(this.state.data.nro_doc) || ''}
              disabled={this.state.loading || this.state.nro_doc_disabled}
              required />
          </div>
          <div className='form-group'>
            <label>Género</label>
            <div className='form-check'>
              <label className='form-check-label'>
                <input
                  type='radio'
                  className='form-check-input'
                  name='sexo'
                  value='F'
                  onChange={this.handleInputChange}
                  defaultChecked={this.state.data.sexo === 'F'}
                  disabled={this.state.loading || this.state.sexo_disabled}
                  required />
                Femenino
              </label>
            </div>
            <div className='form-check'>
              <label className='form-check-label'>
                <input
                  type='radio'
                  className='form-check-input'
                  name='sexo'
                  value='M'
                  onChange={this.handleInputChange}
                  defaultChecked={this.state.data.sexo === 'M'}
                  disabled={this.state.loading || this.state.sexo_disabled}
                  required />
                Masculino
              </label>
            </div>
          </div>

          {!user.profileIsComplete() && (
            <button
              className='btn btn-block btn-success'
              type='submit'
              disabled={this.state.loading}>
              Guardar
            </button>
          )}
        </form>

        {!user.profileIsComplete() && (
          <div className='text-right'>
            <Link
              to='/'
              className='btn btn-sm btn-link'>
              completar mas tarde
              {' '}
              <i className='icon-arrow-right' />
            </Link>
          </div>
        )}
      </div>
    )
  }
}

function prettyNumber (number) {
  if (typeof number !== 'string') return ''
  return (number
    .split('')
    .reverse()
    .join('')
    .match(/[0-9]{1,3}/g) || [])
    .join('.')
    .split('')
    .reverse()
    .join('')
}
