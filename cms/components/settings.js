import React from 'react'
import { Card } from 'material-ui/Card'
import { ViewTitle } from 'admin-on-rest/lib/mui'
import { GET_ONE, UPDATE, RadioButtonGroupInput, ImageInput, Edit, List, Datagrid, EditButton, SimpleForm, TextField, TextInput, SelectInput, ImageField } from 'admin-on-rest'
import restClient from '../../client/rest-client'

const styles = {
  ImageInput: { width: '17em' }
}

export class SettingsEdit extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      settings: {}
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

  render () {
    return (
      <Card>
        <SimpleForm record={this.state.settings}>
          <ViewTitle title='Settings' />
          <TextInput source='settingName' label='Community name' />
          <ImageInput style={styles.ImageInput} source='logo' label='Community logo' accept='image/*'>
            <ImageField source="logo" title="title" />
          </ImageInput>
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
      </Card>
    )
  }
}
