import React from 'react'
import { Card, CardText } from 'material-ui/Card'
import { ViewTitle } from 'admin-on-rest/lib/mui'
import { t } from '../../client/i18n'

export default () => (
  <Card>
    <ViewTitle title={t('admin/welcome')} />
    <CardText>Lorem ipsum sic dolor amet...</CardText>
  </Card>
)
