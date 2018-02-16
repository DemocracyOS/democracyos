import React from 'react'
import {
  Edit,
  ShowButton,
  ListButton,
  RefreshButton,
  EditButton,
  DeleteButton,
  SimpleForm,
  TextInput,
  DateInput,
  LongTextInput
} from 'admin-on-rest'
import { PostTitle } from './post-title'

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
