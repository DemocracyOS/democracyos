import React from 'react'
import {
  ReferenceField,
  ShowButton,
  SimpleShowLayout,
  Show,
  ReferenceInput,
  Datagrid,
  FunctionField,
  TextField,
  Create,
  Edit,
  SimpleForm,
  SelectInput,
  DateField,
  EditButton,
  DeleteButton,
  List,
  TextInput,
  LongTextInput,
  required
} from 'admin-on-rest'
import FromCreateContentDialog from './FromCreateContentDialog'
import ReactionResult from './ReactionResult'

export const ReactionInstanceList = (props) => (
  <List {...props} title='List of reaction instances'>
    <Datagrid>
      <TextField source="title" />
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
      <FromCreateContentDialog />
      <h4 style={{ fontWeight: 600, marginTop: '15px' }}>In short, explain the purpose</h4>
      <h5 style={{ fontWeight: 400, marginTop: '5px' }}>Ex: "Do you think this is a good project?", "Want to help us? Join us!"</h5>
      <TextInput source='title' label='The rule' />
      <h4 style={{ fontWeight: 600, marginTop: '15px' }}>Add instructions or descriptions about this reaction so people understands</h4>
      <h5 style={{ fontWeight: 400, marginTop: '5px' }}>Ex: "If we reach 2000 likes we will present this to the townhall.", "With your support we will contact you to help us with our project" </h5>      
      <LongTextInput source='instruction' label='Type here..' />
      <h4 style={{ fontWeight: 600, marginTop: '15px' }}>Select the content you want people to react</h4>
      <ReferenceInput label="Post to react" source='resourceId' reference='posts' allowEmpty>
        <SelectInput optionText='title' />
      </ReferenceInput>
      <h4 style={{ fontWeight: 600, marginTop: '15px' }}>Select the rule of the reaction</h4>
      <h5 style={{ fontWeight: 400, marginTop: '5px' }}>This states the type and rules of your reaction. Make sure you've create them before creating the instance.</h5>      
      <ReferenceInput label="Reaction rule" source='reactionId' reference='reaction-rule' allowEmpty validate={required}>
        <SelectInput optionText='name' />
      </ReferenceInput>
    </SimpleForm>
  </Create>
)

export const ReactionInstanceEdit = (props) => (
  <Edit {...props} title='Edit a reaction instances'>
    <SimpleForm>
      <h4 style={{ fontWeight: 600, marginTop: '15px' }}>To what your voters are going to react?</h4>
      <TextInput source='title' label='The rule' />
      <h4 style={{ fontWeight: 600, marginTop: '15px' }}>Add instructions or descriptions about this reaction so people understands</h4>
      <LongTextInput source='instruction' label='Type here..' />
    </SimpleForm>
  </Edit>
)

const styleShow = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'auto auto'
  }
}

export const ReactionInstanceShow = (props) => (
  <Show {...props} title='Reaction Instance'>
    <SimpleShowLayout style={styleShow.grid}>
      <SimpleShowLayout>
        <TextField source='title' />
        <TextField source='instruction' />
        <DateField source='createdAt' label='Created' />
        <FunctionField label='Results' render={(record) => `${record.results.length}`} />
        <ReferenceField label='Content title' source='resourceId' reference='posts' linkType='show'>
          <TextField source='title' />
        </ReferenceField>
        <ReferenceField label='Name of the rule' source='reactionId' reference='reaction-rule'>
          <TextField source='name' />
        </ReferenceField>
        <ReferenceField label='Type of rule' source='reactionId' reference='reaction-rule' linkType={false}>
          <TextField source='method' />
        </ReferenceField>
      </SimpleShowLayout>
      <SimpleShowLayout>
        <ReactionResult />
      </SimpleShowLayout>
    </SimpleShowLayout>
  </Show>
)
