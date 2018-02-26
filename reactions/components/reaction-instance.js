import React from 'react'
import { ReferenceField, ShowButton, SimpleShowLayout, Show, ReferenceInput, Datagrid, FunctionField, NumberField, TextField, Create, Edit, SimpleForm, TextInput, SelectInput, DateInput, DateField, EditButton, DeleteButton, List, required, NumberInput, BooleanInput } from 'admin-on-rest'
// import ClosingDateField from './ClosingDateField'
// const METHODS = require('../enum/methods')
// import BookIcon from 'material-ui/svg-icons/action/book'
// export const PostIcon = BookIcon

// const getChoices = () => {
//   let choicesArray = []
//   METHODS.forEach((method) => {
//     choicesArray.push({
//       id: method,
//       name: method
//     })
//   })
//   return choicesArray
// }

// const minClosingDate = () => {
//   let date = new Date()
//   date.setDate(date.getDate() + 1)
//   return date
// }

export const ReactionInstanceList = (props) => (
  <List {...props} title='List of reaction instances'>
    <Datagrid>
      <ReferenceField label='Resource' source='resourceId' reference='posts' linkType='show'>
        <TextField source='title' />
      </ReferenceField>
      <ReferenceField label='Rule' source='reactionId' reference='reaction-rule'>
        <TextField source='name' />
      </ReferenceField>
      <ShowButton />
      <EditButton style={{ textAlign: 'center' }} />
      <DeleteButton style={{ textAlign: 'center' }} />
    </Datagrid>
  </List>
)

export const ReactionInstanceCreate = (props) => (
  <Create {...props} title='Create a reaction instances'>
    <SimpleForm>
      <ReferenceInput label='Select a content' source='resourceId' reference='posts' allowEmpty validate={required}>
        <SelectInput optionText='title' />
      </ReferenceInput>
      <ReferenceInput label='Select a rule' source='reactionId' reference='reaction-rule' allowEmpty validate={required}>
        <SelectInput optionText='name' />
      </ReferenceInput>
      {/* <TextInput source='name' label='Name your rule' />
      <SelectInput source='method' label='Type of Reaction' choices={getChoices()} />
      <NumberInput source='limit' step={1} />
      <DateInput label='Opening date' source='startingDate' defaultValue={new Date()} options={{ minDate: new Date() }} />
      <DateInput label='Closing date' source='closingDate' options={{ minDate: minClosingDate() }} /> */}
    </SimpleForm>
  </Create>
)

export const ReactionInstanceEdit = (props) => (
  <Edit {...props} title='Edit a reaction instances'>
    <SimpleForm>
      {/* <TextInput source='name' label='Name your rule' />
      <TextField source='method' label='Type of Reaction' />
      <NumberInput source='limit' step={1} />
      <DateField label='Opening date' source='startingDate' /> */}
      {/* <DateInput label='Closing date' source='closingDate' options={{ minDate: minClosingDate() }} /> */}
      {/* <ClosingDateField /> */}
    </SimpleForm>
  </Edit>
)

export const ReactionInstanceShow = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <DateField source='createdAt' label='Created' />
      <FunctionField label='Results' render={(record) => `${record.results.length}`} />
      <ReferenceField label='Select a content' source='resourceId' reference='posts' linkType='show'>
        <TextField source='title' />
      </ReferenceField>
      <ReferenceField label='Select a rule' source='reactionId' reference='reaction-rule'>
        <TextField source='name' />
      </ReferenceField>
      <ReferenceField label='Type of rule' source='reactionId' reference='reaction-rule' linkType={false}>
        <TextField source='method' />
      </ReferenceField>
    </SimpleShowLayout>
  </Show>
)
