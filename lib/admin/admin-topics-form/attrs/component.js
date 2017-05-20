import React, { Component } from 'react'

export default ({ forum, topic }) => {
  return (
    <div className='attrs'>
      {forum.topicsAttrs.map((attr) => {
        const FormInput = forms[attr.kind]
        let val

        if (topic && topic.attrs && topic.attrs.hasOwnProperty(attr.name)) {
          val = topic.attrs[attr.name]
        }

        return <FormInput key={attr.name} {...attr} value={val} />
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
      name={`attrs.${name}`}
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
      name={`attrs.${name}`}
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
      name={`attrs.${name}`}
      defaultValue={value}
      required={mandatory}
      validate={mandatory && 'required'}>
      {options.map((opt) => (
        <option key={opt.name} value={opt.name}>{opt.title}</option>
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
              name={`attrs.${name}`} />
          )}
          <input
            type='checkbox'
            onChange={this.handleChange}
            defaultChecked={this.state.checked}
            defaultValue={this.state.checked ? 'true' : undefined}
            name={this.state.checked ? `attrs.${name}` : undefined}
            required={mandatory}
            validate={mandatory && 'required'} />
          {title}
        </label>
      </div>
    )
  }
}
