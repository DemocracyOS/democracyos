import React from 'react'
import { List, Datagrid, TextField, EditButton, Edit, SimpleForm, DisabledInput, SelectInput } from 'admin-on-rest'

export const UserList = (props) => (
  <List {...props}>
    <Datagrid>
      <TextField source='username' />
      <TextField source='name' />
      <TextField source='email' />
      <TextField source='role' />
      <EditButton label='Edit role' />
    </Datagrid>
  </List>
)

export const UserView = (props) => (
  <Edit title={<UserTitle />} {...props}>
    <SimpleForm>
      <DisabledInput source='bio' />
      <SelectInput source='role' choices={[
        { id: 'user', name: 'User', key: 1 },
        { id: 'moderator', name: 'Moderator', key: 2 },
        { id: 'admin', name: 'Admin', key: 3 }
      ]} />
    </SimpleForm>
  </Edit>
)

export const UserTitle = ({ record }) => (
  <span>{record ? `${record.name}` : ''}</span>
)
