import React, { Component } from 'react'
import ReactOutsideEvent from 'react-outside-event'
import update from 'immutability-helper'
import distritos from '../distritos.json'

let distritoCurrent = ''

class FiltersNavbar extends Component {
  constructor (props) {
    super(props)

    this.state = {

      distrito: 'centro',

      appliedFilters: {
        distrito: {
          centro: false,
          noroeste: false,
          norte: false,
          oeste: false,
          sudoeste: false,
          sur: false
        },
        edad: {
          adulto: false,
          joven: false
        },
        anio: {
          proyectos2017: false,
          proyectos2018: false
        },
        estado: {
          proyectado: false,
          ejecutandose: false,
          finalizado: false
        }
      },

      selectFilters: {
        distrito: {
          centro: false,
          noroeste: false,
          norte: false,
          oeste: false,
          sudoeste: false,
          sur: false
        },
        edad: {
          adulto: false,
          joven: false
        },
        anio: {
          proyectos2017: false,
          proyectos2018: false
        },
        estado: {
          proyectado: false,
          ejecutandose: false,
          finalizado: false
        }
      },

      badges: {
        distrito: 0,
        edad: 0,
        anio: 0,
        estado: 0
      },

      activeDropdown: ''
    }
  }

  componentWillReceiveProps(props) {
    if (props.stage !== this.props.stage) {
      switch (props.stage) {
        case 'votacion-abierta':
          this.setState({
            appliedFilters: update (this.state.appliedFilters, {
              distrito: {
                centro: { $set: true },
                noroeste: { $set: false },
                norte: { $set: false },
                oeste: { $set: false },
                sudoeste: { $set: false },
                sur: { $set: false }
              },
              edad: {
                adulto: { $set: true },
                joven: { $set: false }
              },
              estado: {
                proyectado: { $set: false },
                ejecutandose: { $set: false },
                finalizado: { $set: false },
                pendiente: { $set: true },
                perdedor: { $set: false }
              },
              anio: {
                proyectos2017: { $set: false },
                proyectos2018: { $set: true }
              }
            })
          }, this.exposeFilters)
          break
        case 'votacion-cerrada':
          this.setState({
            appliedFilters: update (this.state.appliedFilters, {
              distrito: {
                centro: { $set: false },
                noroeste: { $set: false },
                norte: { $set: false },
                oeste: { $set: false },
                sudoeste: { $set: false },
                sur: { $set: false }
              },
              estado: {
                proyectado: { $set: true },
                ejecutandose: { $set: false },
                finalizado: { $set: false },
                pendiente: { $set: false },
                perdedor: { $set: true }
              },
              anio: {
                proyectos2017: { $set: false },
                proyectos2018: { $set: true }
              }
            })
          }, this.exposeFilters)
          break
        case 'seguimiento':
          this.setState({
            appliedFilters: update (this.state.appliedFilters, {
              distrito: {
                centro: { $set: false },
                noroeste: { $set: false },
                norte: { $set: false },
                oeste: { $set: false },
                sudoeste: { $set: false },
                sur: { $set: false }
              },
              estado: {
                proyectado: { $set: false },
                ejecutandose: { $set: false },
                finalizado: { $set: false }
              },
              anio: {
                proyectos2017: { $set: false },
                proyectos2018: { $set: false }
              },
              edad: {
                adulto: { $set: true },
                joven: { $set: false }
              }
            })
          }, this.exposeFilters)
          break
      }
    }
  }

  // FUNCTIONS

  handleDistritoFilterChange = (distrito) => {
    distritoCurrent = distrito.name
    //resetea los filtros
    let appliedFilters = update(this.state.appliedFilters, {
        distrito: {
          centro: { $set: false },
          noroeste: { $set: false },
          norte: { $set: false },
          oeste: { $set: false },
          sudoeste: { $set: false },
          sur: { $set: false }
        }
      })
    // setea el filtro activo
    appliedFilters.distrito[distritoCurrent] = true
    // aplica los filtros actualizados

    this.setState({
      appliedFilters: appliedFilters,
      distrito: distritoCurrent
    }, () => {
      this.exposeFilters()
    })
  }

  handleEdadFilterChange = (edad) => {
    //resetea el filtro edad
    let appliedFilters = update(this.state.appliedFilters, {
      edad: {
        adulto: { $set: false},
        joven: { $set: false}
      }
    })
    //actualiza filtro edad con la opcion elegida
    appliedFilters.edad[edad] = true
    //aplica los filtros actualizados
    this.setState({
      appliedFilters: appliedFilters
    }, () => {
      this.exposeFilters()
    })
  }

  handleDropdown = (id) => (e) => {
    // si se apreta el botón de un dropdown ya abierto, se cierra
    if (this.state.activeDropdown == id) {
      this.setState({activeDropdown: ''})
    } else {
      // se actualiza selectFilters y se abre el dropdown
      this.setState({
        selectFilters: update(this.state.appliedFilters, { $merge: {} }),
        activeDropdown: id
      })
    }
  }

  // cerrar dropdown si hago click afuera
  onOutsideEvent = () => {
    if (!this.state.activeDropdown) return
    this.setState({activeDropdown: ''})
  }

  handleCheckboxChange = (select) => (e) => {
    const target = e.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const id = target.id

    let selectFilters = update(this.state.selectFilters, { [select]: { [id]: { $set: value } } })

    this.setState({
      selectFilters: selectFilters
    }, function () {
    })
  }

  cancelApplyFilters = () => {
    var appliedFilters = this.state.appliedFilters
    this.setState ({
      // se actualiza selectFilters y se cierra el dropdown
      selectFilters: update(this.state.appliedFilters, { $merge: {} }),
      activeDropdown: ''
    })
  }

  applyFilters = (id) => (e) => {
    this.setState ({
      // actualiza appliedFilters y cierra el dropdown
      appliedFilters: update(this.state.selectFilters, { $merge: {} }),
      activeDropdown: ''
    }, () => {
      this.exposeFilters()
      this.calculateBadges()
    })
  }

  // prepara los filtros para enviar la query definitiva a la API
  exposeFilters = () => {
    let exposedFilters = this.filterCleanup(this.state.appliedFilters)
      switch (this.props.stage) {
        case 'seguimiento':
          exposedFilters.estado.pendiente = false
          exposedFilters.estado.perdedor = false
          break
        case 'votacion-abierta':
          exposedFilters.estado.perdedor = false
          break
        case 'votacion-cerrada':
          exposedFilters.estado.pendiente = false
          break
      }
      this.props.updateFilters(exposedFilters)
  }


  calculateBadges = () => {
    let badges = Object.keys(this.state.appliedFilters)
      .map(f => [f, Object.values(this.state.appliedFilters[f]).filter(boolean => boolean).length])
      .reduce((acc, f) => {acc[f[0]] = f[1]; return acc}, {})

    this.setState({ badges })
  }

  filterCleanup = (filters) => {
    let createTransformation = ob => {
      let transformation = {}
      Object.keys(ob).forEach(k => {
        if (!(Object.values(ob[k]).includes(true))){
          transformation[k] = typeof ob[k] != "object" ? { $set: true } : createTransformation(ob[k])
        }
        if (this.props.stage === 'seguimiento' && k === 'estado' && ob[k].pendiente) {
          transformation[k] = typeof ob[k] != "object" ? { $set: true } : createTransformation(ob[k])
          ob[k].pendiente = false
        }
      })
      return transformation;
    }
    return update(filters, createTransformation(filters))
  }

  changeColor = (id) => {
     if (this.state.badges[id] > 0) { 
      return 'applied-filter'
    } else {  
      return ''
    }
  }

// RENDER
  render () {
    let deltaFecha = Date.parse("Mon, 20 Nov 2017 00:00:00 -0300") - Date.parse(new Date())

    return (
      <div>
      {(this.props.stage === 'votacion-abierta' || this.props.stage === 'votacion-cerrada') && (
        <DistritoFilter
              active={this.state.distrito}
              onChange={this.handleDistritoFilterChange}
              changeEdad={this.handleEdadFilterChange}
              changeStage={this.props.changeStage}
              stage={this.props.stage} 
              appliedFilters={this.state.appliedFilters}/>
      )}
      {this.props.stage === 'seguimiento' && (
        <header>
          { this.props.forumStage === 'votacion-abierta' && (
              <a
                className='link-stage'
                onClick={() => {this.props.changeStage('votacion-abierta')}}>
                  {'< Volver a Votación'}
              </a>
            )
          }
          <div className='stage-header'>
            <div className='pp-stage'>
              Seguimiento de proyectos
            </div>

            <nav className='pp-nav'>
              <button
                type='button'
                data-name='adulto'
                onClick={() => this.handleEdadFilterChange('adulto')}
                className={`btn btn-md btn-outline-primary ${this.state.appliedFilters.edad.adulto ? 'active' : ''}`}>
                <span className='btn-content'><span className='btn-text'>Presupuesto Participativo</span></span>
              </button>
              <button
                type='button'
                data-name='joven'
                onClick={() => this.handleEdadFilterChange('joven')}
                className={`btn btn-md btn-outline-primary ${this.state.appliedFilters.edad.joven ? 'active' : ''}`}>
                <span className='btn-content'><span className='btn-text'>Presupuesto Participativo Joven</span></span>
              </button>
            </nav>
            <p className='header-text'>Filtros adicionales:</p>
          </div>

          <nav>
            <div className='filter'>
              <button
                type='button'
                id="filtro-distrito"
                className = {`btn btn-md btn-outline-primary ${this.changeColor('distrito')}`}
                onClick = {this.handleDropdown('opciones-distrito')}>
                <span className='btn-content'><span className='btn-text'>Distrito</span> {this.state.badges.distrito !== 0 && <span className='badge'>{this.state.badges.distrito}</span>} </span> <span className='caret-down'>▾</span>
              </button>
              {this.state.activeDropdown == 'opciones-distrito' && (
                <div className='filter-dropdown' id="opciones-distrito">

                  <div className='filter-options'>

                    <div className='filter-column'>
                      <div className='option-container'>
                        <div className='check-container'>
                          <input onChange={this.handleCheckboxChange('distrito')} type='checkbox' id='centro' name='distrito' checked={this.state.selectFilters.distrito.centro} />
                          <label htmlFor='centro'></label>
                        </div>
                        <label htmlFor='centro'>Centro</label>
                      </div>
                      <div className='option-container'>
                        <div className='check-container'>
                          <input onChange={this.handleCheckboxChange('distrito')} type='checkbox' id='noroeste' name='distrito' checked={this.state.selectFilters.distrito.noroeste} />
                          <label htmlFor='noroeste'></label>
                        </div>
                        <label htmlFor='noroeste'>Noroeste</label>
                      </div>
                      <div className='option-container'>
                        <div className='check-container'>
                          <input onChange={this.handleCheckboxChange('distrito')} type='checkbox' id='norte' name='distrito' checked={this.state.selectFilters.distrito.norte} />
                          <label htmlFor='norte'></label>
                        </div>
                        <label htmlFor='norte'>Norte</label>
                      </div>
                    </div>

                    <div className='filter-column'>
                      <div className='option-container'>
                        <div className='check-container'>
                          <input onChange={this.handleCheckboxChange('distrito')} type='checkbox' id='oeste' name='distrito' checked={this.state.selectFilters.distrito.oeste} />
                          <label htmlFor='oeste'></label>
                        </div>
                        <label htmlFor='oeste'>Oeste</label>
                      </div>
                      <div className='option-container'>
                        <div className='check-container'>
                          <input onChange={this.handleCheckboxChange('distrito')} type='checkbox' id='sudoeste' name='distrito' checked={this.state.selectFilters.distrito.sudoeste} />
                          <label htmlFor='sudoeste'></label>
                        </div>
                        <label htmlFor='sudoeste'>Sudoeste</label>
                      </div>
                       <div className='option-container'>
                        <div className='check-container'>
                          <input onChange={this.handleCheckboxChange('distrito')} type='checkbox' id='sur' name='distrito' checked={this.state.selectFilters.distrito.sur} />
                          <label htmlFor='sur'></label>
                        </div>
                        <label htmlFor='sur'>Sur</label>
                      </div>
                    </div>

                  </div>
                  <div className='dropdown-actions'>
                    <a className='cancelar' onClick={this.cancelApplyFilters}>Cancelar</a>
                    <a className='aplicar' onClick={this.applyFilters('distrito')}>Aplicar</a>
                  </div>
                </div>
                )}
            </div>

            { deltaFecha <= 0 &&
              <div className='filter'>
                <button
                  type='button'
                  id="filtro-anio"
                  className = {`btn btn-md btn-outline-primary ${this.changeColor('anio')}`}
                  onClick = {this.handleDropdown('opciones-anio')}>
                  <span className='btn-content'><span className='btn-text'>Año</span> {this.state.badges.anio !== 0 && <span className='badge'>{this.state.badges.anio}</span>} </span> <span className='caret-down'>▾</span>
                </button>
                {this.state.activeDropdown == 'opciones-anio' && (
                  <div className='filter-dropdown' id="opciones-anio">
                    <div className='filter-options'>
              
                      <div className='filter-column'>
                        <div className='option-container'>
                          <div className='check-container'>
                            <input onChange={this.handleCheckboxChange('anio')} type='checkbox' id='proyectos2017' name='anio' checked={this.state.selectFilters.anio.proyectos2017} />
                            <label htmlFor='proyectos2017'></label>
                          </div>
                          <label htmlFor='proyectos2017'>2017</label>
                        </div>
                        <div className='option-container'>
                          <div className='check-container'>
                            <input onChange={this.handleCheckboxChange('anio')} type='checkbox' id='proyectos2018' name='anio' checked={this.state.selectFilters.anio.proyectos2018} />
                            <label htmlFor='proyectos2018'></label>
                          </div>
                          <label htmlFor='proyectos2018'>2018</label>
                        </div>
                      </div>
              
                    </div>
                    <div className='dropdown-actions'>
                      <a className='cancelar' onClick={this.cancelApplyFilters}>Cancelar</a>
                      <a className='aplicar' onClick={this.applyFilters('anio')}>Aplicar</a>
                    </div>
                  </div>
                  )}
              </div>
            }

            <div className='filter'>
              <button
                type='button'
                id="filtro-estado"
                className = {`btn btn-md btn-outline-primary ${this.changeColor('estado')}`}
                onClick = {this.handleDropdown('opciones-estado')}>
                <span className='btn-content'><span className='btn-text'>Estado</span> {this.state.badges.estado !== 0 && <span className='badge'>{this.state.badges.estado}</span>} </span> <span className='caret-down'>▾</span>
              </button>
              {this.state.activeDropdown == 'opciones-estado' && (
                <div className='filter-dropdown' id="opciones-estado">
                  <div className='filter-options'>

                    <div className='filter-column'>
                      <div className='option-container'>
                        <div className='check-container'>
                          <input onChange={this.handleCheckboxChange('estado')} type='checkbox' id='proyectado' name='estado' checked={this.state.selectFilters.estado.proyectado} />
                          <label htmlFor='proyectado'></label>
                        </div>
                        <label htmlFor='proyectado'>Proyectados</label>
                      </div>
                      <div className='option-container'>
                        <div className='check-container'>
                          <input onChange={this.handleCheckboxChange('estado')}  type='checkbox' id='ejecutandose' name='estado' checked={this.state.selectFilters.estado.ejecutandose} />
                          <label htmlFor='ejecutandose'></label>
                        </div>
                        <label htmlFor='ejecutandose'>En ejecución</label>
                      </div>
                      <div className='option-container'>
                        <div className='check-container'>
                          <input onChange={this.handleCheckboxChange('estado')} type='checkbox' id='finalizado' name='estado' checked={this.state.selectFilters.estado.finalizado} />
                          <label htmlFor='finalizado'></label>
                        </div>
                        <label htmlFor='finalizado'>Finalizados</label>
                      </div>
                    </div>

                  </div>

                  <div className='dropdown-actions'>
                    <a className='cancelar' onClick={this.cancelApplyFilters}>Cancelar</a>
                    <a className='aplicar' onClick={this.applyFilters('estado')}>Aplicar</a>
                  </div>
                </div>
                )}
            </div>
          </nav>
        </header>
      )}
    </div>
  )} // cierra el render

} // cierra el componente

export default ReactOutsideEvent(FiltersNavbar)

//Navbar en votacion abierta / votacion cerrada

function DistritoFilter (props) {
  const { active, onChange, stage, appliedFilters, changeEdad, changeStage } = props
  return (
    <header>
      { stage === 'votacion-abierta' && (
      <div>
        <a className='link-stage'
          onClick={() => {changeStage('seguimiento')}}>
            {'< Ir a Seguimiento de Proyectos'}
          </a>
        <div className='stage-header'>
          <div className='pp-stage'>
            Votación Abierta
          </div>
          <nav className='pp-nav'>
            <button
              type='button'
              data-name='adulto'
              onClick={() => changeEdad('adulto')}
              className={`btn btn-md btn-outline-primary ${appliedFilters.edad.adulto ? 'active' : ''}`}>
              <span className='btn-content'><span className='btn-text'>Presupuesto Participativo</span></span>
            </button>
            <button
              type='button'
              data-name='joven'
              onClick={() => changeEdad('joven')}
              className={`btn btn-md btn-outline-primary ${appliedFilters.edad.joven ? 'active' : ''}`}>
              <span className='btn-content'><span className='btn-text'>Presupuesto Participativo Joven</span></span>
            </button>
          </nav>
          <p className='header-text'>Elegí tu distrito:</p>
        </div>
      </div>
      )}
      { stage === 'votacion-cerrada' && (
        <div className='stage-header'>
          <div className='pp-stage'>
            Votación Cerrada
          </div>
          <p className='header-text header-text-cerrada'>Elegí tu distrito:</p>
        </div>
      )}
      <nav>
        <div className='filter'>
          {distritos.map((d) => {
            const isActive = d.name === active ? ' active' : ''
            return (
              <button
                type='button'
                key={d.name}
                data-name={d.name}
                onClick={() => onChange(d)}
                className={`btn btn-md btn-outline-primary btn-votacion${isActive}`}>
                <span className='btn-content'><span className='btn-text'>{d.title}</span></span>
              </button>
            )
          })}
        </div>
      </nav>
    </header>
  )
}
