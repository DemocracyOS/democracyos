import React from 'react'
import { Datagrid,
  TextField,
  Create,
  Edit,
  SimpleForm,
  Filter,
  TextInput,
  SelectInput,
  DateInput,
  DateField,
  EditButton,
  DeleteButton,
  List,
  NumberInput } from 'admin-on-rest'
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

const ReactionRuleFilters = (props) => (
  <Filter {...props}>
    <TextInput label='Search' source='name' alwaysOn />
    <SelectInput source='method' choices={getChoices()} />
  </Filter>
)

export const ReactionRuleList = (props) => (
  <List {...props} filters={<ReactionRuleFilters />} title='List of reaction rules'>
    <Datagrid>
      <TextField source='name' label='Name' style={{ fontWeight: 'bold' }} />
      <TextField source='method' label='Type of Reaction' style={{ textTransform: 'capitalize' }} />
      <DateField source='startingDate' label='Start' />
      <DateField source='closingDate' label='Ends' />
      <EditButton style={{ textAlign: 'center' }} />
      <DeleteButton style={{ textAlign: 'center' }} />
    </Datagrid>
  </List>
)

export const ReactionRuleCreate = (props) => (
  <Create {...props} title='Create a reaction rule'>
    <SimpleForm>
      <TextInput source='name' label='Name your rule' />
      <SelectInput source='method' label='Type of reaction?' choices={getChoices()} />
      <NumberInput source='limit' step={1} />
      <DateInput label='When will it start?' source='startingDate' defaultValue={new Date()} options={{ minDate: new Date() }} />
      <ClosingDateField />      
    </SimpleForm>
  </Create>
)

export const ReactionRuleEdit = (props) => (
  <Edit {...props} title='Edit a reaction rule'>
    <SimpleForm>
      <TextInput source='name' label='Name your rule' />
      <TextField source='method' label='What type of reaction is it gonna be?' />
      <NumberInput source='limit' step={1} />
      <DateField label='When will it start?' source='startingDate' />
      <ClosingDateField />
    </SimpleForm>
  </Edit>
)
