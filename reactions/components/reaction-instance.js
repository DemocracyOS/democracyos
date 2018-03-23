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
      <h4 style={{ fontWeight: 600, marginTop: '15px' }}>To what your voters are going to react?</h4>
      <TextInput source='title' label='The rule' />
      <h4 style={{ fontWeight: 600, marginTop: '15px' }}>Add instructions or descriptions about this reaction so people understands</h4>
      <LongTextInput source='instruction' label='Type here..' />
      <h4 style={{ fontWeight: 600, marginTop: '15px' }}>Select the content you want people to react</h4>
      <ReferenceInput label="Post to react" source='resourceId' reference='posts' allowEmpty>
        <SelectInput optionText='title' />
      </ReferenceInput>
      <h4 style={{ fontWeight: 600, marginTop: '15px' }}>Select what kind of reactions do you expect</h4>
      <ReferenceInput label="Reaction Rule" source='reactionId' reference='reaction-rule' allowEmpty validate={required}>
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
