import React from 'react'
import { CardActions } from 'material-ui/Card'
import {
  Edit,
  ShowButton,
  ListButton,
  RefreshButton,
  DeleteButton,
  SimpleForm,
  TextInput,
  DateInput,
  LongTextInput
} from 'admin-on-rest'
import { t } from '../../../client/i18n'
import { PostTitle } from './post-title'
import { ContentInput } from './post-content-input'

const cardActionStyle = {
  zIndex: 2,
  display: 'inline-block',
  float: 'right'
}

const PostEditActions = ({ basePath, data }) => (
  <CardActions style={cardActionStyle}>
    <ShowButton basePath={basePath} record={data} label={t('admin/show')} />
    <ListButton basePath={basePath} label={t('admin/list')} />
    <DeleteButton basePath={basePath} record={data} label={t('admin/delete')} />
    <RefreshButton label={t('admin/refresh')} />
  </CardActions>
)

export const PostEdit = (props) => (
  <Edit
    title={<PostTitle />}
    actions={<PostEditActions />}
    {...props}>
    <SimpleForm>
      <TextInput source='title' label={t('admin/title')} />
      <LongTextInput source='description' label={t('admin/description')} />
      <ContentInput source='content' addLabel label={t('admin/content')} />
      <DateInput label={t('admin/openingDate')} source='openingDate' />
      <DateInput label={t('admin/closingDate')} source='closingDate' />
    </SimpleForm>
  </Edit>
)
