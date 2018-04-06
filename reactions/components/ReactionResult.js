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
import { Link } from 'react-router-dom'

class ReactionResult extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      instanceResult: {
        data: [],
        participants: [],
        reactionRule: {}
      },
      showParticipantsOptIn: false,
      showParticipantsOptOut: false
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
  showModalParticipantsOptIn = () => {
    this.setState({ showParticipantsOptIn: true })
  };

  closeModalParticipantsOptIn = () => {
    this.setState({ showParticipantsOptIn: false })
  };

  showModalParticipantsOptOut = () => {
    this.setState({ showParticipantsOptOut: true })
  };

  closeModalParticipantsOptOut = () => {
    this.setState({ showParticipantsOptOut: false })
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

    const listParticipantsOptIn = this.state.instanceResult.participants.length > 0
      ? this.state.instanceResult.participants.map((x) => {
        if (!x.meta.deleted) {
          return (
            <ListItem containerElement={<Link to={'/users/' + x.userId._id} />} primaryText={x.userId.name} />
          )
        }
      }) : (
        <p>No participants here!</p>
      )

    const listParticipantsOptOut = this.state.instanceResult.participants.length > 0
      ? this.state.instanceResult.participants.map((x) => {
        if (x.meta.deleted) {
          return (
            <ListItem containerElement={<Link to={'/users/' + x.userId._id} />} primaryText={x.userId.name} />
          )
        }
      }) : (
        <p>No participants here!</p>
      )

    // CARD for ReactionLIKE
    return (
      <div>
        <Card>
          <CardHeader
            title={this.state.instanceResult.reactionRule.method + ' Results'}
            subtitle={'Reaction Rule: ' + this.state.instanceResult.reactionRule.name} />
          <CardText>
            <h3 style={styles.counter.title}>LIKES / OPT-OUT</h3>
            <h1 style={styles.counter.number}>{this.state.instanceResult.data.value} / {this.state.instanceResult.participants.length - this.state.instanceResult.data.value}</h1>
          </CardText>
          <CardActions>
            <FlatButton label='List participants' onClick={this.showModalParticipantsOptIn} />
            <FlatButton label='Who opt-out?' onClick={this.showModalParticipantsOptOut} />
          </CardActions>
        </Card >
        <Dialog
          title='List of participants'
          modal={false}
          open={this.state.showParticipantsOptIn}
          onRequestClose={this.closeModalParticipantsOptIn}
          autoScrollBodyContent>
          {listParticipantsOptIn}
        </Dialog>
        <Dialog
          title='List of participants who opt-out from the instance'
          modal={false}
          open={this.state.showParticipantsOptOut}
          onRequestClose={this.closeModalParticipantsOptOut}
          autoScrollBodyContent>
          {listParticipantsOptOut}
        </Dialog>
      </div>
    )
  }
}

export default ReactionResult
