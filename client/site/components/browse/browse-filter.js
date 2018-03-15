import React from 'react'

export default class extends React.Component {
  render () {
    return (
      <nav className='browse-filter-wrapper'>
        <div className='search-box'>
          <h5>Search by words</h5>
          <div>
            <input type='text' placeholder='Serch by words' name='search' />
            <button>
              Search 
            </button>
          </div>
        </div>
        <div className='sort-box'>
          <h5>Sort by</h5>
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
          <h5>Filter by date</h5>
          <div className='filter-box-container'>
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