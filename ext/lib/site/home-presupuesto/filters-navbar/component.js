import React, { Component } from 'react'
import ReactOutsideEvent from 'react-outside-event'
import distritos from '../distritos.json'

let distritoCurrent = ''

class FiltersNavbar extends Component {
  constructor (props) {
    super(props)

    this.state = {

      distrito: distritos[0],

      appliedFilters: {
        edad: {
          adultos: false,
          jovenes: false
        },
        distrito: {
          centro: false,
          noroeste: false,
          norte: false,
          oeste: false,
          sudoeste: false,
          sur: false
        },
        año: {
          proyectos2015: false,
          proyectos2016: false,
          proyectos2017: false
        },
        estado: {
          proyectados: false,
          ejecucion: false,
          finalizados: false
        }
      },

      selectFilters: {
        edad: {
          adultos: false,
          jovenes: false
        },
        distrito: {
          centro: false,
          noroeste: false,
          norte: false,
          oeste: false,
          sudoeste: false,
          sur: false
        },
        año: {
          proyectos2015: false,
          proyectos2016: false,
          proyectos2017: false
        },
        estado: {
          proyectados: false,
          ejecucion: false,
          finalizados: false
        }
      },

      navbarUI: {
        edad: null,
        distrito: null
      },

      activeDropdown: ''
    }
  }

  //this.handleCheckboxChange = this.handleCheckboxChange.bind(this) O USAR ARROW FUNCTION
  // LAS ARROW FUNCTIONS TIENEN EL SCOPE DEL COMPONENTE

  handleCheckboxChange = (select) => (e) => {
    const target = e.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const id = target.id

    let selectFilters = this.state.selectFilters

    selectFilters[select][id] = value

    this.setState({
      selectFilters: selectFilters
    }, function () {
      console.log(this.state.selectFilters)
    })
  }

  cancelApplyFilters = () => {
    console.log('initial applied filters ', this.state.appliedFilters)
    var appliedFilters = this.state.appliedFilters
    this.setState ({
      selectFilters: appliedFilters
      }, function () {
      console.log('selectFilters is now: ', this.state.selectFilters)
      console.log('appliedFilters is now: ', this.state.appliedFilters)
    })
    // cierro el dropdown
    this.setState ({
      activeDropdown: ''
    })
  }

  confirmApplyFilters = () => {
    this.setState ({
      activeDropdown: ''
    })
    /*var selectFilters = this.state.selectFilters
    this.setState ({
      appliedFilters: selectFilters
      }, function () {
      console.log('appliedFilters is now: ', this.state.appliedFilters)
    })*/
  }

  handleDropdown = (id) => (e) => {
    //var appliedFilters = this.state.appliedFilters
    //console.log('applied: ', appliedFilters)
    if (this.state.activeDropdown == id) {
      this.setState({activeDropdown: ''})
    } else {
      this.setState({
      //selectFilters: appliedFilters,
        activeDropdown: id
      })
    }
  }

  handleDistritoFilterChange = (distrito) => {
    distritoCurrent = distrito.name
    window.history.pushState(null, null, `#${distrito.name}`)
    this.setState({ distrito }, this.fetchForums)
  }

  // cerrar dropdown si hago click afuera
  onOutsideEvent = () => {
    if (!this.state.activeDropdown) return
    this.setState({activeDropdown: ''})
  }


  render () {
    return (
      <div>
    {this.props.stage == 'votacion' ? (
        <DistritoFilter
              active={this.state.distrito}
              onChange={this.handleDistritoFilterChange} />
        ) : (
        <header>

          <div className='stage-header'>
            <div className='pp-stage'>
              Seguimiento de proyectos
            </div>
          </div>

          <nav>
            <div className='filter'>
              <button
                type='button'
                id="filtro-edad"
                className='btn btn-md btn-outline-primary'
                onClick={this.handleDropdown('opciones-edad')}
                >
                Rango de edad <span className='badge'>2</span> <span className='caret-down'>▾</span>
              </button>
              {this.state.activeDropdown == 'opciones-edad' && (
              <div className='filter-dropdown' id="opciones-edad">
                <div className='filter-options'>

                  <div className='filter-column'>
                    <div className='option-container'>
                      <div className='check-container'>
                        <input onChange={this.handleCheckboxChange('edad')} type='checkbox' id='adultos' name='edad' checked={this.state.selectFilters.edad.adultos} />
                        <label htmlFor='adultos'></label>
                      </div>
                      <label htmlFor='adultos'>Proyecto adultos</label>
                    </div>
                    <div className='option-container'>
                      <div className='check-container'>
                        <input onChange={this.handleCheckboxChange('edad')} type='checkbox' id='jovenes' name='edad' checked={this.state.selectFilters.edad.jovenes} />
                        <label htmlFor='jovenes'></label>
                      </div>
                      <label htmlFor='jovenes'>Proyecto jóvenes</label>
                    </div>
                  </div>

                </div>
                <div className='dropdown-actions'>
                  <a className='cancelar' onClick={this.cancelApplyFilters}>Cancelar</a>
                  <a className='aplicar' onClick={this.confirmApplyFilters}>Aplicar</a>
                </div>
              </div>
              )}
            </div>

            <div className='filter'>
              <button
                type='button'
                id="filtro-distrito"
                className = 'btn btn-md btn-outline-primary'
                onClick = {this.handleDropdown('opciones-distrito')}>
                Distrito <span className='badge'>3</span> <span className='caret-down'>▾</span>
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
                    <a className='aplicar' onClick={this.confirmApplyFilters}>Aplicar</a>
                  </div>
                </div>
                )}
            </div>

            <div className='filter'>
              <button
                type='button'
                id="filtro-año"
                className = 'btn btn-md btn-outline-primary'
                onClick = {this.handleDropdown('opciones-año')}>
                Año <span className='badge'>2</span> <span className='caret-down'>▾</span>
              </button>
              {this.state.activeDropdown == 'opciones-año' && (
                <div className='filter-dropdown' id="opciones-año">
                  <div className='filter-options'>

                    <div className='filter-column'>
                      <div className='option-container'>
                        <div className='check-container'>
                          <input onChange={this.handleCheckboxChange('año')} type='checkbox' id='proyectos2015' name='año' checked={this.state.selectFilters.año.proyectos2015} />
                          <label htmlFor='proyectos2015'></label>
                        </div>
                        <label htmlFor='proyectos2015'>2015</label>
                      </div>
                      <div className='option-container'>
                        <div className='check-container'>
                          <input onChange={this.handleCheckboxChange('año')} type='checkbox' id='proyectos2016' name='año' checked={this.state.selectFilters.año.proyectos2016} />
                          <label htmlFor='proyectos2016'></label>
                        </div>
                        <label htmlFor='proyectos2016'>2016</label>
                      </div>
                      <div className='option-container'>
                        <div className='check-container'>
                          <input onChange={this.handleCheckboxChange('año')} type='checkbox' id='proyectos2017' name='año' checked={this.state.selectFilters.año.proyectos2017} />
                          <label htmlFor='proyectos2017'></label>
                        </div>
                        <label htmlFor='proyectos2017'>2017</label>
                      </div>
                    </div>

                  </div>
                  <div className='dropdown-actions'>
                    <a className='cancelar' onClick={this.cancelApplyFilters}>Cancelar</a>
                    <a className='aplicar' onClick={this.confirmApplyFilters}>Aplicar</a>
                  </div>
                </div>
                )}
            </div>

            <div className='filter'>
              <button
                type='button'
                id="filtro-estado"
                className = 'btn btn-md btn-outline-primary'
                onClick = {this.handleDropdown('opciones-estado')}>
                Estado <span className='badge'>2</span> <span className='caret-down'>▾</span>
              </button>
              {this.state.activeDropdown == 'opciones-estado' && (
                <div className='filter-dropdown' id="opciones-estado">
                  <div className='filter-options'>

                    <div className='filter-column'>
                      <div className='option-container'>
                        <div className='check-container'>
                          <input onChange={this.handleCheckboxChange('estado')} type='checkbox' id='proyectados' name='estado' checked={this.state.selectFilters.estado.proyectados} />
                          <label htmlFor='proyectados'></label>
                        </div>
                        <label htmlFor='proyectados'>Proyectados</label>
                      </div>
                      <div className='option-container'>
                        <div className='check-container'>
                          <input onChange={this.handleCheckboxChange('estado')}  type='checkbox' id='ejecucion' name='estado' checked={this.state.selectFilters.estado.ejecucion} />
                          <label htmlFor='ejecucion'></label>
                        </div>
                        <label htmlFor='ejecucion'>En ejecución</label>
                      </div>
                      <div className='option-container'>
                        <div className='check-container'>
                          <input onChange={this.handleCheckboxChange('estado')} type='checkbox' id='finalizados' name='estado' checked={this.state.selectFilters.estado.finalizados} />
                          <label htmlFor='finalizados'></label>
                        </div>
                        <label htmlFor='finalizados'>Finalizados</label>
                      </div>
                    </div>

                  </div>

                  <div className='dropdown-actions'>
                    <a className='cancelar' onClick={this.cancelApplyFilters}>Cancelar</a>
                    <a className='aplicar' onClick={this.confirmApplyFilters}>Aplicar</a>
                  </div>
                </div>
                )}
            </div>
          </nav>
        </header>
      )}
      </div>
  )} // cierro el render

} // cierro el componente

export default ReactOutsideEvent(FiltersNavbar)


function DistritoFilter (props) {
  const { active, onChange } = props

  console.log('distritofilter', distritos.map)
  console.log('props', props)

  return (
    <header>
      <div className='stage-header'>
        <div className='pp-stage'>
          Votación abierta
        </div>
        <span className='header-text'>Elegí tu distrito:</span>
      </div>
      <nav>
        <div className='filter'>
          {distritos.map((d) => {
            const isActive = d.name === active.name ? ' active' : ''
            return (
              <button
                type='button'
                key={d.name}
                data-name={d.name}
                onClick={() => onChange(d)}
                className={`btn btn-md btn-outline-primary${isActive}`}>
                {d.title}
              </button>
            )
          })}
        </div>
      </nav>
    </header>
  )
}