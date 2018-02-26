import React, { Component } from 'react'
import t from 't-component'
import 'whatwg-fetch'
import ReactPaginate from 'react-paginate'
import ForumTagsSearch from 'lib/admin/admin-topics-form/tag-autocomplete/component'

const SortButtons = ({
  onSort,
  sortString,
  currentSort
}) => (
  <div className='sort-buttons'>
    <button
      className={sortString === currentSort ? 'active' : ''}
      onClick={onSort(sortString)}>
      {String.fromCharCode(0x25B2)}
    </button>
    <button
      className={`-${sortString}` === currentSort ? 'active' : ''}
      onClick={onSort(`-${sortString}`)}>
      {String.fromCharCode(0x25BC)}
    </button>
  </div>
)

export default class TagsModeration extends Component {
  constructor () {
    super()
    this.state = {
      pages: null,
      currentPage: null,
      sort: '-count',
      limit: null,
      tags: [],
      selectedTags: [],
      modalOpen: false
    }
  }

  componentDidMount () {
    this.fetchTags()
  }

  fetchTags = () => {
    const { forum } = this.props
    const { sort, limit, currentPage } = this.state
    let query = `forum=${forum.id}`
    if (sort) query += `&sort=${sort}`
    if (limit) query += `&limit=${limit}`
    if (currentPage) query += `&page=${currentPage + 1}`

    fetch(`/api/v2/topics/tags?${query}`)
      .then((res) => res.json())
      .then(({ tags, pagination: { total, page, limit } }) => {
        this.setState({
          tags,
          currentPage: page - 1,
          pages: (total / limit)
        })
      })
      .catch((err) => {
        console.log(err)
      })
  }

  handlePageClick = ({ selected }) => {
    this.setState({ currentPage: selected }, this.fetchTags)
  }

  onSort = (sortString) => (e) => {
    this.setState({ sort: sortString }, this.fetchTags)
  }

  selectTag = (index) => (e) => {
    const { selectedTags, tags } = this.state
    const selectedTagText = tags[index].text
    let _selectedTags

    if (selectedTags.includes(selectedTagText)) {
      _selectedTags = selectedTags.filter((text) => text !== selectedTagText)
    } else {
      _selectedTags = [...selectedTags, selectedTagText]
    }
    this.setState({ selectedTags: _selectedTags })
  }

  toggleModal = () => {
    console.log('toggle modal')
    const { modalOpen } = this.state
    this.setState({ modalOpen: !modalOpen })
  }

  render () {
    const {
      tags,
      sort,
      selectedTags,
      currentPage,
      pages,
      modalOpen
    } = this.state

    return (
      <div className='tags-moderation'>
        <table className="table table-hover">
          <thead>
            <tr>
              <th scope="col">
                Etiqueta
                <SortButtons
                  onSort={this.onSort}
                  sortString='tag'
                  currentSort={sort} />
              </th>
              <th scope="col">
                Conteo
                <SortButtons
                  onSort={this.onSort}
                  sortString='count'
                  currentSort={sort} />
              </th>
            </tr>
          </thead>
          <tbody>
            {
              tags.map(({ text, count }, i) => {
                return (
                  <tr
                    key={i}
                    onClick={this.selectTag(i)}
                    className={selectedTags.includes(text) ? 'active' : ''}>
                    <td>{ text }</td>
                    <td>{ count }</td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
        <ReactPaginate
          forcePage={currentPage}
          pageCount={pages}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          previousLabel='<'
          nextLabel='>'
          onPageChange={this.handlePageClick}
          containerClassName='pagination'
          subContainerClassName='pages pagination'
          activeClassName='active' />
        {
          selectedTags.length > 0 &&
          !modalOpen && (
            <button
              className='edit-tag-modal-opener'
              onClick={this.toggleModal}>
              <i className='icon-pencil' />
            </button>
          )
        }
        {
          modalOpen && (
            <div className='tags-modal'>
              <div
                className='overlay'
                onClick={this.toggleModal} />
              <div className='content'>
                Editar etiquetas
                <ForumTagsSearch
                  forum={this.props.forum.id}
                  tags={this.state.selectedTags} />
                <ForumTagsSearch
                  forum={this.props.forum.id} />
              </div>
            </div>
          )
        }
      </div>
    )
  }
}
