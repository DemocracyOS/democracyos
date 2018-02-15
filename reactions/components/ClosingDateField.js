import { Field } from 'redux-form'
import React from 'react'
import Toggle from 'material-ui/Toggle'
import DatePicker from 'material-ui/DatePicker'

class NullClosingDate extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      originalClosingDate: props.input.value,
      showCalendar: (props.input.value !== '')
    }
    this.style = {
      toggle: {
        marginBottom: 16,
        marginTop: 16
      }
    }
  }

  minClosingDate = () => {
    let date = new Date()
    date.setDate(date.getDate() + 1)
    return date
  }

  createDate = () => {
    let date = null
    if (this.state.originalClosingDate !== '') {
      date = new Date(this.state.originalClosingDate)
    } else {
      date = this.minClosingDate()
    }
    return date
  }

  handleChange = (event, active) => {
    console.log(this.state.showCalendar)
    if (active === true) {
      // closingDate is set to null, hide calendar and updateValue.
      this.setState({showCalendar: false})
      this.props.input.onChange(null)
    } else {
      // closingDate will be defined, show calendar and set the calendar to the original date
      this.setState({ showCalendar: true })
      this.props.input.onChange(this.state.originalClosingDate)
    }
  }

  handleChangeDate = (event, date) => {
    // date has changed!
    console.log(this)
    this.props.input.onChange(date)
  }

  render () {
    return (
      <div>
        {this.state.showCalendar
          ? <DatePicker floatingLabelText="Closing Date" defaultDate={this.createDate()} minDate={this.minClosingDate()} onChange={this.handleChangeDate} />
          : null
        }
        <Toggle
          label="No closing date"
          labelPosition="right"
          defaultToggled={!this.state.showCalendar}
          onToggle={this.handleChange}
          style={this.style.toggle}
        />
      </div>
    )
  }
}

const ClosingDateField = () => (
  <span>
    <Field name="closingDate" component={NullClosingDate} label="Closing Date" />
  </span>
)

export default ClosingDateField
