import React from 'react'

export default class PostFilter extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault()
    const data = (e.target)
    console.log(data)
  }

  render () {
    return (
      <nav>
        <button onClick={this.props.sortNew}>
          <span>Newest First</span>
        </button>
        <button onClick={this.props.sortOld}>
          <span>Older First</span>
        </button>
        <form onSubmit={this.handleSubmit}>
          <label htmlFor='from'>
            <span>From:</span>
          </label>
          <input type='date' name='from' ref={(input) => this.fromDate = input} />
          <label htmlFor='to'>
            <span>To:</span>
          </label>
          <input type='date' name='to' ref={(input) => this.toDate = input} />
          <button type='submit'>
            <span>Apply</span>
          </button>
        </form>
      </nav>
    )
  }
}