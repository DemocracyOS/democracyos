import React from 'react'
import {
  Create,
  ShowButton,
  ListButton,
  EditButton,
  DeleteButton,
  RefreshButton,
  SimpleForm,
  TextInput,
  DateInput,
  LongTextInput
} from 'admin-on-rest'
import { PostTitle } from './post-title'
import { ContentInput } from './post-content'

export const PostCreate = (props) => (
  <Create title={<PostTitle />} {...props}>
    <SimpleForm>
      <TextInput source='title' />
      <TextInput source='description' options={{ multiLine: true }} />
      <LongTextInput source='content' />
      <ContentInput />
      <DateInput label='Opening date' source='openingDate' defaultValue={new Date()} />
      <DateInput label='Closing date' source='closingDate' defaultValue={new Date()} />
    </SimpleForm>
  </Create>
)
