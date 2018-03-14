import React from 'react'
import {
  Dialog,
  FlatButton,
  ListItem,
  Card,
  CardActions,
  CardHeader,
  CardText
} from 'material-ui'

class ReactionResult extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      instanceResult: {
        data: [],
        participants: [],
        reactionRule: {}
      },
      showParticipants: false
    }
    this.style = {

    }
  }
  componentWillMount () {
    fetch('/api/v1.0/services/reactions/' + this.props.record._id + '/result', {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      })
    }).then((res) => res.json())
      .then((response) => {
        console.log('Success:', response)
        this.setState({ instanceResult: response })
      })
      .catch((error) => console.error('Error:', error))
  }
  handleOpen = () => {
    this.setState({ showParticipants: true })
  };

  handleClose = () => {
    this.setState({ showParticipants: false })
  };

  render () {
    const styles = {

      counter: {
        title: {
          textAlign: 'center',
          fontWeight: '400'
        },
        number: {
          textAlign: 'center',
          fontSize: '3rem'
        },
        chip: {
          margin: 4
        },
        wrapper: {
          display: 'flex',
          flexWrap: 'wrap'
        }
      }
    }

    const listUsers = this.state.instanceResult.participants.length > 0
      ? this.state.instanceResult.participants.map((x) => {
        return (
          <ListItem primaryText={x.name} />
        )
      }) : (
        <p>No users have participated yet</p>
      )

    // CARD for ReactionLIKE
    return (
      <div>
        <Card>
          <CardHeader
            title={this.state.instanceResult.reactionRule.method + ' Results'}
            subtitle={'Reaction Rule: ' + this.state.instanceResult.reactionRule.name} />
          <CardText>
            <h3 style={styles.counter.title}>LIKES</h3>
            <h1 style={styles.counter.number}>{this.state.instanceResult.data.value}</h1>
          </CardText>
          <CardActions>
            <FlatButton label='List participants' onClick={this.handleOpen} />
          </CardActions>
        </Card >
        <Dialog
          title='List of participants'
          modal={false}
          open={this.state.showParticipants}
          onRequestClose={this.handleClose}
          autoScrollBodyContent>
          {listUsers}
        </Dialog>
      </div>
    )
  }
}

export default ReactionResult
