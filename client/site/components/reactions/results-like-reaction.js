import React from 'react'

export default class extends React.Component {
  constructor (props) {
    super(props)
    this.state = {

    }
  }

  render () {
    const { reaction } = this.props
    // const { state } = this.state
    return (
      <section className='reaction-users'>
        <div className='grid-container'>
          <div>
            <b>{reaction.data.value} users reacted</b>
          </div>
          <div className='avatars'>
            {reaction.participants.map((x) => {
              if (!x.meta.deleted) {
                return (<figure key={x._id} className='participant-avatar' />)
              }
            })
            }
          </div>
        </div>
        <style jsx>{`
          .reaction-users{
            padding:5px 15px;
            background-color: #cacaca;
            border-bottom-left-radius: 10px;
            border-bottom-right-radius: 10px;
            border-bottom:1px solid #AAA;
          }
          .grid-container {
            display: grid;
            grid-template-columns: auto auto;
            grid-gap: 20px;
          }
          .participant-avatar{
            width: 24px;
            height: 24px;
            vertical-align: middle;
            display: inline-block;
            border-radius: 100%;
            margin: 0 2px;
            background-color: purple;
          }
          .avatars{
            text-align: right;
          }
          .link{
            color: blue;
            font-decoration: underline;
          }
        `}</style>
      </section>
    )
  }
}
