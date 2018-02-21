import React from 'react'
import {
  List,
  Datagrid,
  ShowButton,
  ListButton,
  EditButton,
  DeleteButton,
  RefreshButton,
  TextField,
  DateField,
  ReferenceField
} from 'admin-on-rest'

export const PostList = (props) => (
  <List {...props}>
    <Datagrid>
      <TextField source='title' label='Title' />
      <TextField source='description' label='Description' />
      <DateField source='openingDate' label='Opening date' />
      <DateField source='closingDate' label='Closing date' />
      <ReferenceField label='Author' source='author' reference='users' linkType='show'>
        <TextField source='username' />
      </ReferenceField>
      <ShowButton />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
)
