import React from 'react'
import { Card } from 'material-ui/Card'
import Snackbar from 'material-ui/Snackbar'
import {
  ViewTitle,
  GET_ONE,
  UPDATE,
  SimpleForm,
  TextInput,
  SaveButton,
  Toolbar
} from 'admin-on-rest'
import { t } from '../../../client/i18n'
import restClient from '../../../client/admin/components/rest-client'
import SettingsColorPicker from './settings-color-picker'

const SaveSettingsToolbar = (props) => (
  <Toolbar {...props} >
    <SaveButton label={t('admin/save')} redirect={false} submitOnEnter />
  </Toolbar>
)

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
        console.error(err)
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
        <SimpleForm record={this.state.settings}
          save={this.handleSubmit}
          toolbar={<SaveSettingsToolbar />} >
          <ViewTitle title={t('admin/settings')} />
          <TextInput source='communityName' label={t('admin/communityName')} />
          <SettingsColorPicker source='mainColor' addLabel label={t('admin/mainColor')} />
        </SimpleForm>
        <Snackbar
          open={this.state.open}
          message={this.state.status === 'error' ? t('admin/settingsError') : t('admin/settingsUpdated')}
          autoHideDuration={3000}
          onRequestClose={this.handleRequestClose} />
      </Card>
    )
  }
}
