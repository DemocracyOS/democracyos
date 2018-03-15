import React from 'react'

export default class extends React.Component {
  render () {
    return (
      <nav className='browse-filter-wrapper'>
        <div className='search-box'>
          <h6>Search by words</h6>
          <div>
            <input type='text' placeholder='Serch by words' name='search' />
            <button>
              Search 
            </button>
          </div>
        </div>
        <div className='sort-box'>
          <h6>Sort by</h6>
          <select>
            <option>
              Newest first
            </option>
            <option>
              Older first
            </option>
          </select>
        </div>
        <div className='filter-box'>
          <h6>Filter by date</h6>
          <div>
            <label>From:</label>
            <input type='date' />
            <label>To:</label>
            <input type='date' />
            <button>
              Apply
            </button>
          </div>
        </div>
        <style jsx>{`
          .browse-filter-wrapper {
            width: 25%;
          }
        `}</style>
      </nav>
    )
  }
}