import React from 'react'
import { Resource, List, Datagrid, TextField, Create, Edit, Show, ShowButton, ListButton, RefreshButton, SimpleShowLayout, SimpleForm, TextInput, DateInput, LongTextInput, DateField, EditButton, DeleteButton, ReferenceField, CardActions } from 'admin-on-rest'

const PostTitle = ({ record }) => (
  <span>Post {record ? `"${record.title}"` : ''}</span>
)

export const PostList = (props) => (
  <List {...props}>
    <Datagrid>
      <TextField source='title' label='Title' />
      <TextField source='description' label='Description' />
      <DateField source='openingDate' label='Opening date' />
      <DateField source='closingDate' label='Closing date' />
      <ReferenceField label='Author' source='author' reference='users' linkType={false}>
        <TextField source='username' />
      </ReferenceField>
      <ShowButton />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
)

export const PostCreate = (props) => (
  <Create title={<PostTitle />} {...props}>
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
  <Edit title={<PostTitle />} {...props}>
    <SimpleForm>
      <TextInput source='title' />
      <LongTextInput source='description' />
      <LongTextInput source='content' />
      <DateInput label='Opening date' source='openingDate' />
      <DateInput label='Closing date' source='closingDate' />
    </SimpleForm>
  </Edit>
)

export const PostShow = (props) => (
  <Show title={<PostTitle />} {...props}>
    <SimpleShowLayout>
      <TextField source='title' label='Title' />
      <TextField source='description' label='Description' />
      <DateField source='openingDate' label='Opening date' />
      <DateField source='closingDate' label='Closing date' />
      <ReferenceField label='Author' source='author' reference='users' linkType={false}>
        <TextField source='username' />
      </ReferenceField>
    </SimpleShowLayout>
  </Show>
)
