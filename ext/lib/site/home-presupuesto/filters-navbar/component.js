import React, { Component } from 'react'

class FiltersNavbar extends Component {
  constructor (props) {
    super(props)

    this.state = {

      appliedFilters: {
        edad: {
          adultos: true,
          jovenes: true
        },
        distrito: {
          centro: true,
          noroeste: true,
          norte: true,
          oeste: true,
          sudoeste: true,
          sur: true
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
    debugger
    const target = e.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name

    this.setState({
      selectFilters[select][name]: value
    }, function(){
      //console.log(this.state[name])
    })
  }

  cancelApplyFilters = (e) => {
    this.setState ({
      selectFilters: appliedFilters
      }), function () {
      console.log('selectFilters is now: ', selectFilters)
    }
  }

  confirmApplyFilters = (e) => {
    this.setState ({
      appliedFilters: selectFilters
      }), function () {
      console.log('appliedFilters is now: ', appliedFilters)
    }
  }

  render () {
    return (
    <nav>
      <div className='filter'>
        <button
          type='button'
          id="filtro-edad"
          className = 'btn btn-md btn-outline-primary'>
          Filtro por edad <span>▾</span>
          <div className='filter-dropdown' id="opciones-edad">
            <div className='filter-options'>
              <label htmlFor='adultos'>
              <input onChange={this.handleCheckboxChange('edad')} type='checkbox' name='adultos' checked={this.state.selectFilters.edad.adultos} />
              Proyecto adultos
              </label>
              <label htmlFor='jovenes'>
              <input onChange={this.handleCheckboxChange('edad')} type='checkbox' name='jovenes' checked={this.state.selectFilters.edad.jovenes} />
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
          Filtro por distrito <span>▾</span>
          <div className='filter-dropdown' id="opciones-distrito">
            <div className='filter-options'>
              <label htmlFor='centro'>
                <input onChange={this.handleCheckboxChange} type='checkbox' name='centro' checked={this.state.selectFilters.distrito.centro} />
              Centro
              </label>
              <label htmlFor='noroeste'>
                <input onChange={this.handleCheckboxChange} type='checkbox' name='noroeste' checked={this.state.selectFilters.distrito.noroeste} />
              Noroeste
              </label>
              <label htmlFor='norte'>
                <input onChange={this.handleCheckboxChange} type='checkbox' name='norte' checked={this.state.selectFilters.distrito.norte} />
              Norte
              </label>
            </div>
            <div className='filter-options'>
              <label htmlFor='oeste'>
                <input onChange={this.handleCheckboxChange} type='checkbox' name='oeste' checked={this.state.selectFilters.distrito.oeste} />
              Oeste
              </label>
              <label htmlFor='sudoeste'>
                <input onChange={this.handleCheckboxChange} type='checkbox' name='sudoeste' checked={this.state.selectFilters.distrito.sudoeste} />
              Sudoeste
              </label>
              <label htmlFor='sur'>
                <input onChange={this.handleCheckboxChange} type='checkbox' name='sur' checked={this.state.selectFilters.distrito.sur} />
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

    </nav>
  )
  }

}

export default FiltersNavbar