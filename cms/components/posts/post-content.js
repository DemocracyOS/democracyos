import React from 'react'
import { Field } from 'redux-form'
import { Editor, EditorState } from 'draft-js'

class PostContent extends React.Component {
  constructor (props) {
    super(props)
    this.state = { editorState: EditorState.createEmpty() }
    this.onChange = (editorState) => this.setState({ editorState })
  }
  render () {
    return (
      <Editor editorState={this.state.editorState} onChange={this.onChange} />
    )
  }
}

export const ContentInput = () => (
  <span>
    <Field name='content' component={PostContent} placeholder='Post content' />
  </span>
)
