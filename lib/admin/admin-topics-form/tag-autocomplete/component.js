import React, { Component } from 'react'
import 'whatwg-fetch'
import tagsInput from 'tags-input'
import RadixTrie from 'radix-trie'

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
    this.trie = new RadixTrie()
  }

  componentWillMount () {
    window.fetch('/api/v2/forums/' + this.props.forum + '/search/tags')
      .then((res) => res.json())
      .then((res) => {
        this.trie.addMany(res.tags)
      })
      .catch((err) => { console.log(err) })
  }

  inputMount = (e) => {
    tagsInput(e)
    const input = e.parentNode.querySelector('.tags-input input')
    input.addEventListener('keydown', this.searchTags, false)
    input.addEventListener('focusout', () => { this.setState({ tags: [] }) }, false)
  }

  searchTags = (ev) => {
    if (ev.keyCode === 40) return this.selectMove(ev.target, true)
    if (ev.keyCode === 38) return this.selectMove(ev.target, false)
    const tags = !ev.target.value ? [] : this.trie.autocomplete(ev.target.value)
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

  clearActiveItem (e) {
    const activeItem = e.target.querySelector('.active')
    if (activeItem) {
      activeItem.classList.remove('active')
    }
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
                this.state.tags.map((tag, i) => <li key={i}>{ tag }</li>)
              }
            </ul>
          )
        }
      </div>
    )
  }
}
