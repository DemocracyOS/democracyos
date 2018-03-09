import React from 'react'
import { Field } from 'redux-form'

export default () => (
  <span>
    <Field name='mainColor' component='input' type='color' />
  </span>
)