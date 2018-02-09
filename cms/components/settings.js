import React from 'react';
import { connect } from 'react-redux';
import { Card, CardText } from 'material-ui/Card';
import { RadioButtonGroupInput, ImageInput, Edit, List, Datagrid, EditButton, SimpleForm, TextField, TextInput, SelectInput, ImageField } from 'admin-on-rest';



const styles = {
  ImageInput: { width: '17em'}
};



export const SettingsList = (props) => (
  <List {...props}>
    <Datagrid>
      <TextField source='id' />
      <TextField source='settingName' />
      <EditButton />
    </Datagrid>
  </List>
)

export const SettingsEdit = (props) => (
  <Edit title="Community settings" {...props}>

  <SimpleForm>

  <TextInput source='settingName' />

  <ImageInput style={styles.ImageInput} source="logo" label="Community logo" accept="image/*">
    <ImageField source="logo" title="title" />
   </ImageInput>

  <SelectInput  source='permissions' choices={[
    { id: 'admin', name: 'admin' },
    { id: 'user', name: 'user' },
    { id: 'moderator', name: 'moderator' },
     ]} /> 
   
   <RadioButtonGroupInput source="theme" choices={[
    { id: 'Dark', name: 'Dark' },
    { id: 'Light', name: 'Light' },
    { id: 'Siena', name: 'Siena' },
    { id: 'Light Blue', name: 'Light Blue' },
    { id: 'Red', name: 'Red' },
]} />

  </SimpleForm>
  </Edit>
)