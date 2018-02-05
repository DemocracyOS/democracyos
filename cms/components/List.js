import React from 'react'
import { List, Datagrid, TextField } from 'admin-on-rest'

export const PostList = (props) => (
  <List {...props}>
    <Datagrid>
      <TextField source='id' />
    </Datagrid>
  </List>
)
