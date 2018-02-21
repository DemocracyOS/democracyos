import React from 'react'
import { List, Datagrid, TextField, ShowButton, Show, SimpleShowLayout } from 'admin-on-rest'

export const UserList = (props) => (
  <List {...props}>
    <Datagrid>
      <TextField source='username' />
      <TextField source='name' />
      <TextField source='email' />
      <ShowButton />
    </Datagrid>
  </List>
)

export const UserShow = (props) => (
  <Show title={<UserTitle />} {...props}>
    <SimpleShowLayout>
      <TextField source='bio' />
    </SimpleShowLayout>
  </Show>
)

export const UserTitle = ({ record }) => (
  <span>{record ? `${record.name}` : ''}</span>
)
