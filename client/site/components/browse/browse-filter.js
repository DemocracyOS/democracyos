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

  handleChange = (e) => {
    const name = e.target.name
    const value = e.target.value
    this.setState({
      [name]: value
    }, () => name === 'sort' && this.sendFilters())
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
      filters.filter.date = [new Date(this.state.dateFrom), new Date(this.state.dateTo)]
    }
    this.props.handleFetch(filters)
  }

  render () {
    return (
      <nav className='browse-filter-wrapper'>
        <div className='search-box'>
          <h5>Search by words</h5>
          <div>
            <input type='text' placeholder='Search by words' name='word' value={this.state.word} onChange={this.handleChange} />
            <button onClick={this.handleSubmit}>
              Search
            </button>
          </div>
        </div>
        <div className='sort-box'>
          <h5>Sort by</h5>
          <select name='sort' onChange={this.handleChange} value={this.state.sort}>
            <option value={'["date", "ASC"]'}>
              Newest first
            </option>
            <option value={'["date", "DESC"]'}>
              Older first
            </option>
          </select>
        </div>
        <div className='filter-box'>
          <h5>Filter by date</h5>
          <div className='filter-box-container'>
            <form onSubmit={this.handleSubmit}>
              <label htmlFor='dateFrom'>From:</label>
              <input type='date' name='dateFrom' value={this.state.dateFrom} onChange={this.handleChange} />
              <label htmlFor='dateTo'>To:</label>
              <input type='date' name='dateTo' value={this.state.dateTo} onChange={this.handleChange} />
              <button type='submit'>
                Apply
              </button>
            </form>
          </div>
        </div>
        <style jsx>{`
          .browse-filter-wrapper {
            width: 25%;
          }
          .filter-box-container {
            display: flex;
            flex-wrap: wrap;
            flex-direction: column;
            padding-right: 30px;
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
