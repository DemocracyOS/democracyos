import React, { Component } from 'react'

class FiltersNavbar extends Component {
  constructor (props) {
    super(props)

    this.state = {
      edad: '',
      adultos: '',
      jovenes: '',
      distrito: '',
      centro: '',
      noroeste: '',
      norte: '',
      oeste: '',
      sudoeste: '',
      sur: ''
    }
  }

  //this.handleCheckboxChange = this.handleCheckboxChange.bind(this) O USAR ARROW FUNCTION
  // LAS ARROW FUNCTIONS TIENEN EL SCOPE DEL COMPONENTE


  handleCheckboxChange = (e) => {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    }, function(){
      console.log(this.state[name])
    });
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
              <input onChange={this.handleCheckboxChange} type='checkbox' name='adultos' checked={this.state.adultos} />
              Proyecto adultos
              </label>
              <label htmlFor='jovenes'>
              <input type='checkbox' name='jovenes' checked={this.state.jovenes} />
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
                <input type='checkbox' name='centro' checked={this.state.centro} />
              Centro
              </label>
              <label htmlFor='noroeste'>
                <input type='checkbox' name='noroeste' checked={this.state.noroeste} />
              Noroeste
              </label>
              <label htmlFor='norte'>
                <input type='checkbox' name='norte' checked={this.state.norte} />
              Norte
              </label>
            </div>
            <div className='filter-options'>
              <label htmlFor='oeste'>
                <input type='checkbox' name='oeste' checked={this.state.oeste} />
              Oeste
              </label>
              <label htmlFor='sudoeste'>
                <input type='checkbox' name='sudoeste' checked={this.state.sudoeste} />
              Sudoeste
              </label>
              <label htmlFor='sur'>
                <input type='checkbox' name='sur' checked={this.state.sur} />
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