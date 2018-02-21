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
import { ContentField } from './post-content-field'

export const PostShow = (props) => (
  <Show title={<PostTitle />} {...props}>
    <SimpleShowLayout>
      <TextField source='title' label='Title' />
      <TextField source='description' label='Description' />
      <ContentField source='content' label='Content' addLabel />
      <DateField source='openingDate' label='Opening date' />
      <DateField source='closingDate' label='Closing date' />
      <ReferenceField label='Author' source='author' reference='users' linkType='show'>
        <TextField source='username' />
      </ReferenceField>
    </SimpleShowLayout>
  </Show>
)
