import React from 'react'
import Paper from 'material-ui/Paper'
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from 'material-ui/Table'
import {
  ReferenceField,
  TextField
} from 'admin-on-rest'
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card'

class ReactionResult extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      // reactionIds: props.record.results,
      instanceResult: {
        data: []
      },
      reactionRule: {
        name: ''
      }
    }
    this.style = {

    }
  }
  componentWillMount () {
    let params = {
      limit: '2',
      page: '1',
      ids: JSON.stringify(this.props.record.results)
    }

    let esc = encodeURIComponent
    let query = Object.keys(params)
      .map((k) => esc(k) + '=' + esc(params[k]))
      // .map((k) => k + '=' + params[k])
      .join('&')

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
    fetch('/api/v1.0/reaction-rule/' + this.props.record.reactionId, {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      })
    }).then((res) => res.json())
      .then((response) => {
        console.log('Success:', response)
        this.setState({ reactionRule: response })
      })
      .catch((error) => console.error('Error:', error))
  }

  render () {
    const style = {
      position: 'absolute',
      right: '60px' /* Magic! */
    }

    return (
      <Card style={style}>
        <CardHeader
          title='Results'
          subtitle={'Reaction Rule: ' + this.state.reactionRule.name} />
        <CardText>
          {this.state.instanceResult.data.map(function (data) {
            return (<p>Option: {data.option} - Count: {data.value}</p>)
          })
          }
        </CardText>
      </Card >
    )
  }
}

// const ClosingDateField = () => (
//   <span>
//     <Field name='closingDate' component={NullClosingDate} label='Closing Date' />
//   </span>
// )

export default ReactionResult
