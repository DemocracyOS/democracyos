import React, { Component } from 'react'
import tagsInput from 'tags-input'
import fuzzysearch from 'fuzzysearch'

export default class ForumTagsSearch extends Component {
  constructor (props) {
    super(props)

    this.state = {
      showList: false,
      tags: [],
      allTags: [],
      tagsRetrieved: false,
      query: ''
    }
  }

  componentWillMount () {
    const { initialTags } = this.props
    window.fetch(`/api/v2/forums/${this.props.forum}/tags`)
      .then((res) => res.json())
      .then((res) => {
        let tags = res.results.tags.map(({ tag }) => tag)
        if (initialTags) {
          let initialUniqueTags = initialTags.filter((t) => !~tags.indexOf(t))
          tags = initialTags ? tags.concat(initialUniqueTags) : tags
        }
        this.setState({ allTags: tags })
      })
      .catch((err) => { console.log(err) })
  }

  inputMount = (el) => {
    if (!el) return
    tagsInput(el)

    const input = el.parentNode.querySelector('.tags-input input')
    input.addEventListener('keydown', this.searchTags, false)
    input.addEventListener('focusout', () => {
      this.setState({ tags: [] })
    }, false)
  }

  searchTags = (evt) => {
    const input = evt.target

    if (evt.keyCode === 40) return this.selectMove(input, true)
    if (evt.keyCode === 38) return this.selectMove(input, false)

    const tags = input.value ? this.state.allTags.filter((t) => fuzzysearch(input.value, t)) : []

    this.setState({ tags })
  }

  selectMove (input, direction) {
    const list = input.parentNode.parentNode.querySelector('ul')
    if (!list) return

    const active = list.querySelector('.active')
    if (!active) {
      input.value = list.querySelector('li').textContent
      return list.querySelector('li').classList.add('active')
    }

    const newSelect = active[direction ? 'nextSibling' : 'previousSibling']
    if (newSelect) {
      active.classList.remove('active')
      newSelect.classList.add('active')
      input.value = newSelect.textContent
    }
  }

  clearActiveItem (evt) {
    const activeItem = evt.target.querySelector('.active')
    if (activeItem) activeItem.classList.remove('active')
  }

  setActiveItem (evt) {
    const activeItem = evt.target.parentNode.querySelector('.active')
    if (activeItem) activeItem.classList.remove('active')
    evt.target.classList.add('active')
    evt.target.parentNode.parentNode.querySelector('.tags-input input').value = evt.target.textContent
  }

  render () {
    return (
      <div className='forum-tag-search'>
        <input
          ref={this.inputMount}
          name='tags'
          defaultValue={this.props.tags ? this.props.tags.join(',') : ''} />
        {
          this.state.tags.length > 0 &&
          (
            <ul
              onMouseOver={this.clearActiveItem}
              className='tag-list'
              ref={this.listMount}>
              {
                this.state.tags.map((tag, i) => <li onMouseOver={this.setActiveItem} key={i}>{ tag }</li>)
              }
            </ul>
          )
        }
      </div>
    )
  }
}
