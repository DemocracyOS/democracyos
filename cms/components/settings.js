import React from 'react'
import { Card } from 'material-ui/Card'
import { showNotification, ViewTitle,  GET_ONE, UPDATE, RadioButtonGroupInput, FlatButton, Toolbar, ImageInput, Edit, List, Datagrid, EditButton, SimpleForm, TextField, TextInput, SelectInput, ImageField } from 'admin-on-rest'
import restClient from '../../client/rest-client'
import Snackbar from 'material-ui/Snackbar'

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
          <TextInput source='settingName' label='Community name' />
          {/*<ImageInput style={styles.ImageInput} source='logo' label='Community logo' accept='image/*'>
            <ImageField source="logo" title="title" />
          </ImageInput>*/}
          <SelectInput source='permissions' choices={[
            { id: 'admin', name: 'admin', key: 1 },
            { id: 'user', name: 'user', key: 2 },
            { id: 'moderator', name: 'moderator', key: 3 }
          ]} />
          <RadioButtonGroupInput source='theme' choices={[
            { id: 'Dark', name: 'Dark', key: 1 },
            { id: 'Light', name: 'Light', key: 2 },
            { id: 'Siena', name: 'Siena', key: 3 },
            { id: 'Light Blue', name: 'Light Blue', key: 4 },
            { id: 'Red', name: 'Red', key: 5 }
          ]} />
        </SimpleForm>
        <Snackbar
          open={this.state.open}
          message={this.state.status === 'error' ? 'Error: Can not update. Please try again' : 'Settings updated'}
          autoHideDuration={3000}
          onRequestClose={this.handleRequestClose}
        />
      </Card>
    )
  }
}
