import React from 'react';
import { connect } from 'react-redux';
import { Card, CardText } from 'material-ui/Card';
import { Create, Edit, List, Datagrid, SimpleForm, TextInput, SelectInput, ImageField, Textfield } from 'admin-on-rest';


export const SettingsCreate = (props) => (
  <List {...props}>
    <Datagrid>
      <TextInput source='mainName' />
      <SelectInput source='permissions' choiceschoices={[
        { id: 'admin', name: 'admin' },
        { id: 'user', name: 'user' },
         { id: 'moderator', name: 'moderator' },
         ]} /> 
   <ImageField source="url" title="logo" />
   </Datagrid>
  </List>
)

export const SettingsEdit = (props) => (
  <Edit {...props}>
  <TextInput source='mainName' />
  <SelectInput source='permissions' choiceschoices={[
    { id: 'admin', name: 'admin' },
    { id: 'user', name: 'user' },
     { id: 'moderator', name: 'moderator' },
     ]} /> 
  <ImageField source="url" title="logo" />

  </Edit>
)
