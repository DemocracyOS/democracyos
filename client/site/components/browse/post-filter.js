import React from 'react'

export default class PostFilter extends React.Component {
  handleSort = (order) => () => {
    this.props.sort('openingDate', order)
  }

  handleFilterByDate = (e) => {
    e.preventDefault()
    console.log(this.from.value, this.to.value)
    this.props.filterByDate(new Date(this.from.value), new Date(this.to.value))
  }

  render () {
    return (
      <nav>
        <button onClick={this.handleSort(1)}>
          <span>Newest First</span>
        </button>
        <button onClick={this.handleSort(-1)}>
          <span>Older First</span>
        </button>
        <form onSubmit={this.handleFilterByDate}>
          <label htmlFor='from'>
            <span>From:</span>
          </label>
          <input type='date' name='from' ref={(input) => this.from = input} />
          <label htmlFor='to'>
            <span>To:</span>
          </label>
          <input type='date' name='to' ref={(input) => this.to = input} />
          <button type='submit'>
            <span>Apply</span>
          </button>
        </form>
      </nav>
    )
  }
}
