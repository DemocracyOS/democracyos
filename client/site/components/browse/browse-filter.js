import React from 'react'
import PropTypes from 'prop-types'

class BrowseFilter extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      word: '',
      dateFrom: '',
      dateTo: '',
      sort: '["id", "DESC"]'
    }
  }

  deleteDates = () => {
    this.setState({
      dateFrom: '',
      dateTo: ''
    }, () => this.sendFilters())
  }

  deleteSort = () => {
    this.setState({
      sort: '["id", "DESC"]'
    }, () => this.sendFilters())
  }

  deleteWord = () => {
    this.setState({
      word: ''
    }, () => this.sendFilters())
  }

  handleChange = (e) => {
    const name = e.target.name
    const value = e.target.value
    this.setState({
      [name]: value
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.sendFilters()
  }

  sendFilters = () => {
    const filters = {
      filter: {},
      sort: this.state.sort
    }
    if (this.state.word !== '') {
      filters.filter.title = this.state.word
    }
    if (this.state.dateFrom !== '' && this.state.dateTo !== '') {
      filters.filter.openingDate = [new Date(this.state.dateFrom), new Date(this.state.dateTo)]
    }
    this.props.handleFetch(filters)
  }

  render () {
    return (
      <nav className='browse-filter-wrapper'>
        <div className='search-box'>
          <div className='browse-filter-header'>
            <h5>Search</h5>
            {this.state.word !== '' &&
              <button className='browse-filter-delete-button' onClick={this.deleteWord}>
                <span>
                  &times;
                </span>
              </button>
            }
          </div>
          <div className='form-group'>
            <input type='text' className='form-control' placeholder='Search by words' name='word' value={this.state.word} onChange={this.handleChange} />
          </div>
          <div className='btn-container text-center'>
            <button className='btn btn-primary' onClick={this.handleSubmit}>
              Search
            </button>
          </div>
        </div>
        <div className='sort-box'>
          <div className='browse-filter-header'>
            <h5>Sort</h5>
            {this.state.sort !== '["id", "DESC"]' &&
              <button className='browse-filter-delete-button' onClick={this.deleteSort}>
                <span>
                  &times;
                </span>
              </button>
            }
          </div>
          <select name='sort' className='custom-select form-group' onChange={this.handleChange} value={this.state.sort}>
            <option defaultValue disabled value='["id", "DESC"]'>
              Choose an option
            </option>
            <option value='["openingDate", "DESC"]'>
              Newest first
            </option>
            <option value='["openingDate", "ASC"]'>
              Older first
            </option>
          </select>
          <div className='button-container text-center'>
            <button className='btn btn-primary' type='submit' onClick={this.sendFilters}>
              Apply
            </button>
          </div>
        </div>
        <div className='filter-box'>
          <div className='browse-filter-header'>
            <h5>Filter by date</h5>
            {this.state.dateFrom !== '' && this.state.dateTo !== '' &&
              <button className='browse-filter-delete-button' onClick={this.deleteDates}>
                <span>
                  &times;
                </span>
              </button>
            }
          </div>
          <form className='filter-box-container' onSubmit={this.handleSubmit}>
            <div className='form-group'>
              <label htmlFor='dateFrom'>From:</label>
              <div className='input-group date'>
                <input type='date'
                  name='dateFrom'
                  value={this.state.dateFrom}
                  onChange={this.handleChange}
                  className='form-control' />
                <span className='input-group-addon'>
                  <span className='glyphicon glyphicon-calendar' />
                </span>
              </div>
            </div>
            <div className='form-group'>
              <label htmlFor='dateTo'>To:</label>
              <div className='input-group date'>
                <input type='date'
                  name='dateTo'
                  value={this.state.dateTo}
                  onChange={this.handleChange}
                  className='form-control' />
                <span className='input-group-addon'>
                  <span className='glyphicon glyphicon-calendar' />
                </span>
              </div>
            </div>
            <div className='button-container text-center'>
              <button className='btn btn-primary' type='submit'>
                Apply
              </button>
            </div>
          </form>
        </div>
        <style jsx>{`
          .browse-filter-wrapper {
            width: 25%;
            padding-right: 25px;
          }
          .filter-box-container {
            display: flex;
            flex-wrap: wrap;
            flex-direction: column;
            padding-right: 30px;
          }
          .browse-filter-header {
            display: flex;
            align-items: baseline;
            justify-content: space-between;
            margin-bottom: 10px;
          }
          .browse-filter-delete-button {
            display: flex;
            justify-content: center;
            align-content: center;
            background-color: var(--primary);
            border: 0px;
            border-radius: 50%;
            cursor: pointer;
            padding: 2px 5px;
            line-height: normal;
          }
          .browse-filter-delete-button span {
            color: var(--white);
          }
          .browse-filter-delete-button:hover {
            background-color: #0069d9;
            border-color: #0062cc;
          }
          .button-container {
            margin-bottom: 10px;
          }
        `}</style>
      </nav>
    )
  }
}

BrowseFilter.propTypes = {
  handleFetch: PropTypes.func.isRequired
}

export default BrowseFilter
