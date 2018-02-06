import React from 'react'
import { Resource, List, Datagrid, TextField } from 'admin-on-rest'

export default (props) => (
  <List {...props}>
        <Datagrid>
          <TextField source="id" />
          <TextField source="title" />
          <TextField source="content" />
        </Datagrid>
    </List>
)