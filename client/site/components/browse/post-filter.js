import React from 'react'
import PropTypes from 'prop-types'

export default class PostFilter extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      sort: false,
      filterDate: false,
      searchByWords: false,
      words: '',
      openingDate: '',
      closingDate: ''
    }
  }

  clearFilter = (filter) => () => {
    this.props.clearFilter(filter)
    this.setState({
      [filter]: false
    })
  }

  handleChange = (e) => {
    const name = e.target.name
    const value = e.target.value
    this.setState({
      [name]: value
    })
  }

  handleFilterByDate = (e) => {
    e.preventDefault()
    this.props.handleFilterByDate(new Date(this.state.openingDate), new Date(this.state.closingDate))
    this.setState({
      filterDate: true,
      searchByWords: false
    })
  }
  handleSearch = (e) => {
    e.preventDefault()
    this.props.searchByWords(this.state.words)
    this.setState({
      sort: false,
      filterDate: false,
      searchByWords: true
    })
  }
  handleSort = (order) => () => {
    const sortOrder = order === 1 ? 'newToOld' : 'oldToNew'
    if (!this.state.sort || this.state.sort !== sortOrder) {
      this.props.handleSort('openingDate', order)
      this.setState({
        sort: sortOrder
      })
    } else {
      this.props.clearFilter('sort')
      this.setState({
        sort: false
      })
    }
  }

  render () {
    return (
      <nav className='filters-container'>
        {console.log(this.props)}
        <div className='search-box-container'>
          <form onSubmit={this.handleSearch}>
            <label htmlFor='words' >
              Search by words
            </label>
            <input type='text' name='words' value={this.state.words} onChange={this.handleChange} />
            <button className='btn btn-primary'>
              Search
            </button>
            {this.state.searchByWords &&
              <button className='btn btn-primary' onClick={this.clearFilter('searchByWords')}>
                x
              </button>
            }
          </form>
        </div>
        <div className='sort-buttons-container'>
          <label>Sort posts: </label>
          <button className={`btn ${this.state.sort === 'newToOld' ? 'btn-primary' : ''}`} onClick={this.handleSort(1)}>
            New to old
          </button>
          <button className={`btn ${this.state.sort === 'oldToNew' ? 'btn-primary' : ''}`} onClick={this.handleSort(-1)}>
            Old to new
          </button>
        </div>
        <div className='date-filter-container'>
          <form onSubmit={this.handleFilterByDate}>
            <label>Filter posts by date range:</label>
            <label htmlFor='openingDate'>
              <span>From:</span>
            </label>
            <input type='date' name='openingDate' value={this.state.openingDate} onChange={this.handleChange} />
            <label htmlFor='closingDate'>
              <span>To:</span>
            </label>
            <input type='date' name='closingDate' value={this.state.closingDate} onChange={this.handleChange} />
            <button className='btn btn-primary' type='submit'>
              Apply
            </button>
            {this.state.filterDate &&
              <button className='btn btn-primary' onClick={this.clearFilter('filterDate')}>
                x
              </button>
            }
          </form>
        </div>
        <style jsx>{`
          label {
            font-weight: bold;
            font-size: 14px;
            color: rgba(0, 0, 0, 0.7);
            display: block;
          }
          .filters-container {
            display: flex;
            justify-content: space-around;
          }
          .btn {
            margin-left: 10px;
          }
          input[type="date"]{
            height: 38px;
          }
        `}</style>
      </nav>
    )
  }
}

PostFilter.propTypes = {
  clearFilter: PropTypes.func,
  handleFilterByDate: PropTypes.func,
  handleSort: PropTypes.func,
  searchByWords: PropTypes.func
}
