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
  ReferenceField,
  Filter,
  TextInput,
  ReferenceInput,
  SelectInput
} from 'admin-on-rest'

const PostFilters = (props) => (
  <Filter {...props}>
    <TextInput label='Search' source='title' alwaysOn />
    <ReferenceInput label='Author' source='author' reference='users'>
      <SelectInput optionText='username' />
    </ReferenceInput>
  </Filter>
)

export const PostList = (props) => (
  <List {...props} filters={<PostFilters />}>
    <Datagrid>
      <TextField source='title' label='Title' />
      <TextField source='description' label='Description' />
      <DateField source='openingDate' label='Opening date' />
      <DateField source='closingDate' label='Closing date' />
      <ReferenceField label='Author' source='author._id' reference='users' linkType='edit'>
        <TextField source='name' />
      </ReferenceField>
      <ShowButton />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
)
