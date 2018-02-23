import React, { Component } from 'react'
import t from 't-component'
import 'whatwg-fetch'
import ReactPaginate from 'react-paginate'

export default class TagsModeration extends Component {
  constructor () {
    super()
    this.state = {
      pages: null,
      currentPage: null,
      sort: null,
      tags: []
    }
  }

  componentDidMount () {
    fetch(`/api/v2/topics/tags?forum=${this.props.forum.id}`)
      .then((res) => res.json())
      .then(({ tags, pagination: { total, page, limit } }) => {
        this.setState({
          tags,
          currentPage: page,
          pages: (total / limit)
        })
      })
      .catch((err) => {
        console.log(err)
      })
  }

  handlePageClick () {
    console.log('handle click')
  }

  render () {
    const { tags } = this.state
    return (
      <div className='comments-admin'>
        <table className="table table-hover">
          <thead>
            <tr>
              <th scope="col">Etiqueta</th>
              <th scope="col">Conteo</th>
            </tr>
          </thead>
          <tbody>
            {
              tags.map(({ tag, count }, i) => {
                return <tr key={i}>
                  <td>{ tag }</td>
                  <td>{ count }</td>
                </tr>
              })
            }
          </tbody>
        </table>
        <ReactPaginate
          forcePage={this.state.currentPage}
          pageCount={this.state.pages}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          previousLabel='<'
          nextLabel='>'
          onPageChange={this.handlePageClick}
          breakClassName='break-me'
          containerClassName='pagination'
          subContainerClassName='pages pagination'
          activeClassName='active' />
      </div>
    )
  }
}
