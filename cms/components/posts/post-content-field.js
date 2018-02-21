import React from 'react'
import { Editor, EditorState, convertFromRaw } from 'draft-js'

export class ContentField extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      'editorState': EditorState.createWithContent(convertFromRaw(JSON.parse(this.props.record.content)))
    }
  }

  render () {
    return (
      <Editor editorState={this.state.editorState} />
    )
  }
}
