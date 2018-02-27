import { Field } from 'redux-form'
import React from 'react'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'

class FromCreateContent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      showDialog: (this.getQueryVariable('fromCreation') === 'true')
    }
    this.style = {
      // toggle: {
      //   marginBottom: 16,
      //   marginTop: 16
      // }
    }
    this.actions = [
      <FlatButton
        label='Ok!'
        primary
        onClick={this.handleClose} />
    ]
  }

  getQueryVariable = (variable) => {
    let query = window.location.search.substring(1)
    let vars = query.split('&')
    for (let i = 0; i < vars.length; i++) {
      let pair = vars[i].split('=')
      if (pair[0] === variable) {
        return pair[1]
      }
    }
    return (false)
  }

  handleClose = () => {
    this.setState({ showDialog: false })
  }

  render () {
    return (
      <div>
        {this.getQueryVariable('fromCreation')
          ? <Dialog
            title='Add a Reaction?'
            modal={false}
            actions={this.actions}
            open={this.state.showDialog}
            onRequestClose={this.handleClose}>
            You've just created a content! You can create reactions for your content by creating a reaction Instance. Just select the content and the rule and you are all set!
          </Dialog>
          : null
        }
      </div>
    )
  }
}

const FromCreateContentDialog = () => (
  <span>
    <Field component={FromCreateContent} />
  </span>
)

export default FromCreateContentDialog
