import React, { Component } from 'react'

class FiltersNavbar extends Component {
  constructor (props) {
    super(props)

    this.state = {

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
          enEjecucion: false,
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
          enEjecucion: false,
          finalizados: false
        }
      },

      navbarUI: {
        edad: null,
        distrito: null
      }
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
    }, function() {
      console.log(this.state.selectFilters)
    })
  }

  cancelApplyFilters = () => {
    console.log(this.state.appliedFilters)
    var appliedFilters = this.state.appliedFilters
    this.setState ({
      selectFilters: appliedFilters
      }, function () {
      console.log('selectFilters is now: ', this.state.selectFilters)
    })
  }

  confirmApplyFilters = () => {
    debugger
    var selectFilters = this.state.selectFilters
    this.setState ({
      appliedFilters: selectFilters
      }), function () {
      console.log('appliedFilters is now: ', this.state.appliedFilters)
    }
  }

  render () {
    return (
    <nav>

      <div className='pp-stage'>
        Seguimiento de proyectos
      </div>

      <div className='filter'>
        <button
          type='button'
          id="filtro-edad"
          className = 'btn btn-md btn-outline-primary'>
          Rango de edad <span>▾</span>
          <div className='filter-dropdown' id="opciones-edad">
            <div className='filter-options'>
              <label htmlFor='adultos'>
              <input onChange={this.handleCheckboxChange('edad')} type='checkbox' id='adultos' name='edad' checked={this.state.selectFilters.edad.adultos} />
              Proyecto adultos
              </label>
              <label htmlFor='jovenes'>
              <input onChange={this.handleCheckboxChange('edad')} type='checkbox' id='jovenes' name='edad' checked={this.state.selectFilters.edad.jovenes} />
              Proyecto jóvenes
              </label>
            </div>
            <div className='dropdown-actions'>
              <a className='cancelar' onClick={this.cancelApplyFilters}>Cancelar</a>
              <a className='aplicar' onClick={this.confirmApplyFilters}>Aplicar</a>
            </div>
          </div>
        </button>
      </div>

      <div className='filter'>
        <button
          type='button'
          id="filtro-distrito"
          // key={d.name}
          // data-name={d.name}
          // onClick={() => onChange(d)}
          // className={`btn btn-md btn-outline-primary${isActive}`}>
          className = 'btn btn-md btn-outline-primary'>
          Distrito <span>▾</span>
          <div className='filter-dropdown' id="opciones-distrito">
            <div className='filter-options'>
              <label htmlFor='centro'>
                <input onChange={this.handleCheckboxChange('distrito')} type='checkbox' id='centro' name='distrito' checked={this.state.selectFilters.distrito.centro} />
              Centro
              </label>
              <label htmlFor='noroeste'>
                <input onChange={this.handleCheckboxChange('distrito')} type='checkbox' id='noroeste' name='distrito' checked={this.state.selectFilters.distrito.noroeste} />
              Noroeste
              </label>
              <label htmlFor='norte'>
                <input onChange={this.handleCheckboxChange('distrito')} type='checkbox' id='norte' name='distrito' checked={this.state.selectFilters.distrito.norte} />
              Norte
              </label>
            </div>
            <div className='filter-options'>
              <label htmlFor='oeste'>
                <input onChange={this.handleCheckboxChange('distrito')} type='checkbox' id='oeste' name='distrito' checked={this.state.selectFilters.distrito.oeste} />
              Oeste
              </label>
              <label htmlFor='sudoeste'>
                <input onChange={this.handleCheckboxChange('distrito')} type='checkbox' id='sudoeste' name='distrito' checked={this.state.selectFilters.distrito.sudoeste} />
              Sudoeste
              </label>
              <label htmlFor='sur'>
                <input onChange={this.handleCheckboxChange('distrito')} type='checkbox' id='sur' name='distrito' checked={this.state.selectFilters.distrito.sur} />
              Sur
              </label>
            </div>
            <div className='dropdown-actions'>
              <a className='cancelar' onClick={this.cancelApplyFilters}>Cancelar</a>
              <a className='aplicar' onClick={this.confirmApplyFilters}>Aplicar</a>
            </div>
          </div>
        </button>
      </div>

      <div className='filter'>
        <button
          type='button'
          id="filtro-año"
          className = 'btn btn-md btn-outline-primary'>
          Año <span>▾</span>
          <div className='filter-dropdown' id="opciones-año">
            <div className='filter-options'>
              <label htmlFor='proyectos2015'>
              <input onChange={this.handleCheckboxChange('año')} type='checkbox' id='proyectos2015' name='año' checked={this.state.selectFilters.año.proyectos2015} />
              2015
              </label>
              <label htmlFor='proyectos2016'>
              <input onChange={this.handleCheckboxChange('año')} type='checkbox' id='proyectos2016' name='año' checked={this.state.selectFilters.año.proyectos2016} />
              2016
              </label>
              <label htmlFor='proyectos2017'>
              <input onChange={this.handleCheckboxChange('año')} type='checkbox' id='proyectos2017' name='año' checked={this.state.selectFilters.año.proyectos2017} />
              2017
              </label>
            </div>
            <div className='dropdown-actions'>
              <a className='cancelar' onClick={this.cancelApplyFilters}>Cancelar</a>
              <a className='aplicar' onClick={this.confirmApplyFilters}>Aplicar</a>
            </div>
          </div>
        </button>
      </div>

      <div className='filter'>
        <button
          type='button'
          id="filtro-estado"
          className = 'btn btn-md btn-outline-primary'>
          Estado <span>▾</span>
          <div className='filter-dropdown' id="opciones-estado">
            <div className='filter-options'>

              <div className='option-container'>
                <div className='check-container'>
                  <input onChange={this.handleCheckboxChange('estado')} type='checkbox' id='proyectados' className='invisible' name='estado' checked={this.state.selectFilters.estado.proyectados} />
                  <label htmlFor='proyectados' className='custom-check'></label>
                </div>
                <label htmlFor='proyectados'>Proyectados</label>
              </div>

              <label htmlFor='en-ejecucion'>
              <input onChange={this.handleCheckboxChange('estado')} type='checkbox' id='en-ejecucion' name='estado' checked={this.state.selectFilters.estado.enEjecucion} />
              En ejecución
              </label>
              <label htmlFor='finalizados'>
              <input onChange={this.handleCheckboxChange('estado')} type='checkbox' id='finalizados' name='estado' checked={this.state.selectFilters.estado.finalizados} />
              Finalizados
              </label>
            </div>
            <div className='dropdown-actions'>
              <a className='cancelar' onClick={this.cancelApplyFilters}>Cancelar</a>
              <a className='aplicar' onClick={this.confirmApplyFilters}>Aplicar</a>
            </div>
          </div>
        </button>
      </div>

    </nav>
  )
  }

}

export default FiltersNavbar