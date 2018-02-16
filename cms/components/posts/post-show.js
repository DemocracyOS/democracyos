import React from 'react'
import {
  Show,
  ShowButton,
  ListButton,
  EditButton,
  DeleteButton,
  RefreshButton,
  SimpleShowLayout,
  DateField,
  TextField,
  ReferenceField
} from 'admin-on-rest'
import { PostTitle } from './post-title'

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
