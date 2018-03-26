import React from 'react'
import { CardActions } from 'material-ui/Card'
import {
  Show,
  SimpleShowLayout,
  DateField,
  TextField,
  ReferenceField,
  EditButton,
  ListButton,
  DeleteButton,
  RefreshButton
} from 'admin-on-rest'
import { t } from '../../../client/i18n'
import { PostTitle } from './post-title'
import { ContentField } from './post-content-field'

const cardActionStyle = {
  zIndex: 2,
  display: 'inline-block',
  float: 'right'
}

const PostShowActions = ({ basePath, data }) => (
  <CardActions style={cardActionStyle}>
    <EditButton basePath={basePath} record={data} label={t('admin/edit')} />
    <ListButton basePath={basePath} label={t('admin/list')} />
    <DeleteButton basePath={basePath} record={data} label={t('admin/delete')} />
    <RefreshButton label={t('admin/refresh')} />
  </CardActions>
)

export const PostShow = (props) => (
  <Show title={<PostTitle />}
    resource='posts'
    actions={<PostShowActions />}
    {...props}>
    <SimpleShowLayout>
      <TextField source='title' label={t('admin/title')} />
      <TextField source='description' label={t('admin/description')} />
      <ContentField source='content' addLabel label={t('admin/content')} />
      <DateField source='openingDate' label={t('admin/openingDate')} />
      <DateField source='closingDate' label={t('admin/closingDate')} />
      <ReferenceField label={t('admin/author')} source='author' reference='users' linkType='edit'>
        <TextField source='name' />
      </ReferenceField>
    </SimpleShowLayout>
  </Show>
)
