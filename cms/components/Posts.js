import React from 'react'
import { Resource, List, Datagrid, TextField, Create, Edit, SimpleForm, DisabledInput, TextInput, DateInput, LongTextInput, DateField, EditButton, DeleteButton, PostTitle } from 'admin-on-rest'
import BookIcon from 'material-ui/svg-icons/action/book'
export const PostIcon = BookIcon

export const PostList = (props) => (
  <List {...props}>
    <Datagrid>
      <TextField source='id' />
      <TextField source='content' />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
)

export const PostCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source='title' />
      <TextInput source='description' options={{ multiLine: true }} />
      <LongTextInput source='content' />
      <DateInput label='Opening date' source='openingDate' defaultValue={new Date()} />
      <DateInput label='Closing date' source='closingDate' defaultValue={new Date()} />
    </SimpleForm>
  </Create>
)

export const PostEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput source='title' />
      <LongTextInput source='description' />
      <LongTextInput source='content' />
      <DateInput label='Opening date' source='openingDate' />
      <DateInput label='Closing date' source='closingDate' />
    </SimpleForm>
  </Edit>
)
