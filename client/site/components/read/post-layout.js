import React from 'react'
import { Editor, EditorState, convertFromRaw } from 'draft-js'

export default class extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      'editorState': EditorState.createWithContent(convertFromRaw(JSON.parse(this.props.post.content)))
    }
  }

  render () {
    const { post } = this.props
    const { editorState } = this.state
    return (
      <section className='post'>
        <div className='post-wrapper'>
          <div className='post-author'>
            <div className='post-author-profile-pic' />
            <div className='post-author-text'>
              <span className='post-author-name'>{post.author.name}</span>
              <span className='post-date'>{post.openingDate}</span>
            </div>
          </div>
          <div className='post-header'>
            <h3 className='post-title'>{post.title}</h3>
            { post.description &&
              <h4 className='post-description'>{post.description}</h4>
            }
          </div>
          <div className='post-content'>
            <Editor editorState={editorState} />
          </div>
          <div className='post-footer'>
            <div className='post-author-profile-pic' />
            <div className='post-author-text'>
              <span className='post-author-name'>{post.author.name}</span>
            </div>
          </div>
        </div>
        <style jsx>{`
          .post {
            display: flex;
            justify-content: center;
          }
          .post-wrapper {
            width: 740px;
          }
          .post-author {
            display: flex;
            align-items: center;
            font-size: 16px;
            padding: 35px 0 10px;
            border-top: 1px solid rgba(0, 0, 0, 0.2);
          }
          .post-author-profile-pic {
            height: 60px;
            width: 60px;
            border-radius: 100%;
            background: rgba(0, 0, 0, 0.5);
          }
          .post-author-text {
            padding-left: 15px;
          }
          .post-author-text span {
            display: block;
          }
          .post-date {
            color: rgba(0, 0, 0, .54);
          }
          .post-title {
            font-size: 42px;
            margin-top: 39px;
          }
          .post-description {
            font-size: 28px;
            margin: 5px 0 2px;
            color: rgba(0, 0, 0, 0.54);
          }
          .post-content {
            margin-top: 29px;
            font-size: 21px;
            color: rgba(0, 0, 0, 0.84);
            line-height: 33.18px;
          }
          .post-footer {
            margin: 39px 0;
            padding-top: 35px;
            border-top: 1px solid rgba(0, 0, 0, 0.2);
            display: flex;
            align-items: center;
          }
        `}</style>
      </section>
    )
  }
}
