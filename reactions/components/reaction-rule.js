import React from 'react'
import { Datagrid, TextField, Create, Edit, SimpleForm, TextInput, SelectInput, DateInput, DateField, EditButton, DeleteButton, List, NumberInput, BooleanInput } from 'admin-on-rest'
import ClosingDateField from './ClosingDateField'
const METHODS = require('../enum/methods')
// import BookIcon from 'material-ui/svg-icons/action/book'
// export const PostIcon = BookIcon

const getChoices = () => {
  let choicesArray = []
  METHODS.forEach((method) => {
    choicesArray.push({
      id: method,
      name: method
    })
  })
  return choicesArray
}

const minClosingDate = () => {
  let date = new Date()
  date.setDate(date.getDate() + 1)
  return date
}

export const ReactionRuleList = (props) => (
  <List {...props} title="List of reaction rules">
    <Datagrid>
      <TextField source='name' label="Regla" style={{ fontWeight: 'bold' }} />
      <TextField source='method' label="Reaction" style={{ textTransform: 'capitalize' }} />
      <EditButton style={{ textAlign: 'center' }} />
      <DeleteButton style={{ textAlign: 'center' }} />
    </Datagrid>
  </List>
)

export const ReactionRuleCreate = (props) => (
  <Create {...props} title="Create a reaction rule">
    <SimpleForm>
      <TextInput source='name' label="Name your rule" />
      <SelectInput source="method" label="Type of Reaction" choices={getChoices()} />
      <NumberInput source="limit" step={1} />
      <DateInput label='Opening date' source='startingDate' defaultValue={new Date()} options={{ minDate: new Date() }} />
      <DateInput label='Closing date' source='closingDate' options={{ minDate: minClosingDate() }} />
    </SimpleForm>
  </Create>
)

export const ReactionRuleEdit = (props) => (
  <Edit {...props} title="Edit a reaction rule">
    <SimpleForm>
      <TextInput source='name' label="Name your rule" />
      <TextField source="method" label="Type of Reaction" />
      <NumberInput source="limit" step={1} />
      <DateField label='Opening date' source='startingDate'/>
      {/* <DateInput label='Closing date' source='closingDate' options={{ minDate: minClosingDate() }} /> */}
      <ClosingDateField/>
    </SimpleForm>
  </Edit>
)
