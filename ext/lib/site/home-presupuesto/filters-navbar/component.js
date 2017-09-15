import React, { Component } from 'react'

class FiltersNavbar extends Component {
  constructor (props) {
    super(props)
  }

  render () {
    return (
    <nav>
  {/*{buttonFilters.map((d) => {
    const filterApplied = d.filterStatus === filterStatus.name ? ' active' : ''
    return (
    METER LOS BOTONES ACA
    )
    })} 
  */}
      <div className='filter'>
        <button
          type='button'
          id="filtro-edad"
          // key={d.name}
          // data-name={d.name}
          // onClick={() => onChange(d)}
          // className={`btn btn-md btn-outline-primary${isActive}`}>
          className = 'btn btn-md btn-outline-primary'>
          Filtro por edad <span>▾</span>
          <div className='filter-dropdown' id="opciones-edad">
            <div className='filter-options'>
              <label htmlFor='adultos'>
              <input type='checkbox' name='adultos' value='adultos' />
              Proyecto adultos
              </label>
              <label htmlFor='jovenes'>
              <input type='checkbox' name='jovenes' value='jovenes' />
              Proyecto jóvenes
              </label>
            </div>
            <div className='dropdown-actions'>
              <a className='cancelar'>Cancelar</a>
              <a className='aplicar'>Aplicar</a>
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
                <input type='checkbox' name='centro' value='centro' />
              Centro
              </label>
              <label htmlFor='noroeste'>
                <input type='checkbox' name='noroeste' value='noroeste' />
              Noroeste
              </label>
              <label htmlFor='norte'>
                <input type='checkbox' name='norte' value='norte' />
              Norte
              </label>
            </div>
            <div className='filter-options'>
              <label htmlFor='oeste'>
                <input type='checkbox' name='oeste' value='oeste' />
              Oeste
              </label>
              <label htmlFor='sudoeste'>
                <input type='checkbox' name='sudoeste' value='sudoeste' />
              Sudoeste
              </label>
              <label htmlFor='sur'>
                <input type='checkbox' name='sur' value='sur' />
              Sur
              </label>
            </div>
            <div className='dropdown-actions'>
              <a className='cancelar'>Cancelar</a>
              <a className='aplicar'>Aplicar</a>
            </div>
          </div>
        </button>
      </div>

    </nav>
  )
  }

}

export default FiltersNavbar