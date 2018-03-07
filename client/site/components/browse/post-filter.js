import React from 'react'

export default class PostFilter extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      sort: false,
      filterDate: false
    }
  }

  clearFilterByDate = () => {
    this.props.clearFilter('filter')
    this.setState({
      filterDate: false
    })
  }

  handleFilterByDate = (e) => {
    e.preventDefault()
    this.props.handleFilterByDate(new Date(this.from.value), new Date(this.to.value))
    this.setState({
      filterDate: true
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
        <div className='sort-buttons-container'>
          <p>Sort posts: </p>
          <button className={`btn ${this.state.sort === 'newToOld' ? 'btn-primary' : ''}`} onClick={this.handleSort(1)}>
            New to old
          </button>
          <button className={`btn ${this.state.sort === 'oldToNew' ? 'btn-primary' : ''}`} onClick={this.handleSort(-1)}>
            Old to new
          </button>
        </div>
        <div className='date-filter-container'>
          <form onSubmit={this.handleFilterByDate}>
            <p>Filter posts by date range:</p>
            <label htmlFor='from'>
              <span>From:</span>
            </label>
            <input type='date' name='from' ref={(input) => this.from = input} />
            <label htmlFor='to'>
              <span>To:</span>
            </label>
            <input type='date' name='to' ref={(input) => this.to = input} />
            <button className='btn btn-primary' type='submit'>
              Apply
            </button>
            {this.state.filterDate &&
              <button className='btn btn-primary' onClick={this.clearFilterByDate}>
                x
              </button>
            }
          </form>
        </div>
        <style jsx>{`
          p {
            font-weight: bold;
            font-size: 14px;
            color: rgba(0, 0, 0, 0.7);
          }
          .filters-container {
            display: flex;
            justify-content: space-between;
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
