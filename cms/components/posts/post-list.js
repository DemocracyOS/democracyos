import React from 'react'
import { CardActions } from 'material-ui/Card'
import {
  List,
  Datagrid,
  ShowButton,
  EditButton,
  DeleteButton,
  TextField,
  DateField,
  ReferenceField,
  Filter,
  TextInput,
  ReferenceInput,
  SelectInput,
  CreateButton,
  RefreshButton
} from 'admin-on-rest'
import { t } from '../../../client/i18n'

const PostFilters = (props) => (
  <Filter {...props} title={t('admin/addFilter')}>
    <TextInput label={t('admin/search')} source='title' alwaysOn />
    <ReferenceInput label={t('admin/author')} source='author' reference='users'>
      <SelectInput optionText='username' />
    </ReferenceInput>
  </Filter>
)

const cardActionStyle = {
  zIndex: 2,
  display: 'inline-block',
  float: 'right'
}

const PostActions = ({ resource, filters, displayedFilters, filterValues, basePath, showFilter }) => (
  <CardActions style={cardActionStyle}>
    {filters && React.cloneElement(filters, { resource, showFilter, displayedFilters, filterValues, context: 'button' }) }
    <CreateButton label={t('admin/create')} basePath={basePath} />
    <RefreshButton label={t('admin/refresh')} />
  </CardActions>
)

export const PostList = (props) => (
  <List {...props}
    actions={<PostActions />}
    filters={<PostFilters />}
    resource='posts'
    title={t('admin/posts')}>
    <Datagrid>
      <TextField source='title' label={t('admin/title')} />
      <TextField source='description' label={t('admin/description')} />
      <DateField source='openingDate' label={t('admin/openingDate')} />
      <DateField source='closingDate' label={t('admin/closingDate')} />
      <ReferenceField label={t('admin/author')} source='author._id' reference='users' linkType='edit'>
        <TextField source='name' />
      </ReferenceField>
      <ShowButton />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
)
