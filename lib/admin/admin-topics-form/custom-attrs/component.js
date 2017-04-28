import React, { Component } from 'react'

export default ({ forum, topic }) => {
  return (
    <div className='custom-attrs'>
      {forum.topicsCustomAttrs.map((attr) => {
        const Form = forms[attr.kind]
        const val = topic.customAttrs && topic.customAttrs[attr.name]
        return <Form key={attr.name} {...attr} value={val} />
      })}
    </div>
  )
}

const forms = {}

forms.Number = ({
  name,
  title,
  mandatory,
  min,
  max,
  value
}) => (
  <div className='form-group kind-number'>
    <label>{title}</label>
    <input
      className='form-control'
      type='number'
      name={`customAttrs.${name}`}
      defaultValue={value}
      min={min}
      max={max}
      required={mandatory}
      validate={mandatory && 'required'} />
  </div>
)

forms.String = ({
  name,
  title,
  mandatory,
  min,
  max,
  value
}) => (
  <div className='form-group kind-string'>
    <label>{title}</label>
    <input
      className='form-control'
      type='text'
      name={`customAttrs.${name}`}
      defaultValue={value}
      minLength={min}
      maxLength={max}
      required={mandatory}
      validate={mandatory && 'required'} />
  </div>
)

forms.Enum = ({
  name,
  title,
  mandatory,
  options,
  value
}) => (
  <div className='form-group kind-enum'>
    <label>{title}</label>
    <select
      className='form-control'
      name={`customAttrs.${name}`}
      defaultValue={value}
      required={mandatory}
      validate={mandatory && 'required'}>
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
)

forms.Boolean = class extends Component {
  constructor (props) {
    super(props)

    this.state = {
      checked: props.value
    }
  }

  handleChange = (evt) => {
    this.setState({
      checked: !this.state.checked
    })
  }

  render () {
    const {
      name,
      title,
      mandatory
    } = this.props

    return (
      <div className='checkbox'>
        <label>
          {!this.state.checked && (
            <input
              type='hidden'
              value='false'
              name={`customAttrs.${name}`} />
          )}
          <input
            type='checkbox'
            onChange={this.handleChange}
            defaultChecked={this.state.checked}
            defaultValue={this.state.checked ? 'true' : undefined}
            name={this.state.checked ? `customAttrs.${name}` : undefined}
            required={mandatory}
            validate={mandatory && 'required'} />
          {title}
        </label>
      </div>
    )
  }
}
