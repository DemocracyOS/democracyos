import React from 'react'
import { Card } from 'material-ui/Card'
import Snackbar from 'material-ui/Snackbar'
import {
  ViewTitle,
  GET_ONE,
  UPDATE,
  RadioButtonGroupInput,
  SimpleForm,
  TextInput
} from 'admin-on-rest'
import restClient from '../../../client/admin/components/rest-client'
import SettingsColorPicker from './settings-color-picker'

const styles = {
  ImageInput: { width: '17em' }
}

export class SettingsEdit extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      settings: {},
      open: false,
      status: ''
    }
  }

  componentDidMount () {
    restClient(GET_ONE, 'settings')
      .then((req) => {
        this.setState({ settings: req.data })
      })
      .catch((err) => {
        console.log(err)
      })
  }

  handleSubmit = (newSettings) => {
    restClient(UPDATE, 'settings', { id: this.state.settings._id, data: newSettings })
      .then(() => {
        this.setState({
          open: true,
          status: 'success'
        })
      })
      .catch((e) => {
        console.error(e)
        this.setState({
          open: true,
          status: 'error'
        })
      })
  }

  handleRequestClose = () => {
    this.setState({
      open: false,
      status: ''
    })
  }

  render () {
    return (
      <Card>
        <SimpleForm record={this.state.settings} save={this.handleSubmit}>
          <ViewTitle title='Settings' />
          <TextInput source='communityName' label='Community name' />
          <SettingsColorPicker source='mainColor' addLabel label='Main color' />
        </SimpleForm>
        <Snackbar
          open={this.state.open}
          message={this.state.status === 'error' ? 'Error: Can not update. Please try again' : 'Settings updated'}
          autoHideDuration={3000}
          onRequestClose={this.handleRequestClose} />
      </Card>
    )
  }
}
