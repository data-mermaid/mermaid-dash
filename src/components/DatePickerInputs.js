import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components/macro'
import DateFnsUtils from '@date-io/date-fns'
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers'
import IconButton from '@material-ui/core/IconButton'
import ClearIcon from '@material-ui/icons/Clear'

const DatePickerWrapper = styled(DatePicker)`
  width: 100%;
`
const formatDateQuery = date => {
  const year = date?.getFullYear()
  const month = date?.getMonth() + 1
  const day = date?.getDate()

  return year || month || day ? `${year}-${month}-${day}` : null
}

const DatePickerInputs = ({
  startDate,
  endDate,
  handleStartDateValueChange,
  handleEndDateValueChange,
  addQueryStrings,
}) => {
  const handleClrStartDate = e => {
    e.stopPropagation()
    handleStartDateValueChange(null)
    addQueryStrings('sample_date_after', '')
  }

  const handleClrEndDate = e => {
    e.stopPropagation()
    handleEndDateValueChange(null)
    addQueryStrings('sample_date_before', '')
  }

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <DatePickerWrapper
        autoOk
        format="MMM dd, yyyy"
        id="start-date-picker"
        label="Start Date"
        value={startDate}
        onChange={date => {
          const dateQuery = formatDateQuery(date)

          handleStartDateValueChange(dateQuery)
          addQueryStrings('sample_date_after', dateQuery)
        }}
        InputProps={
          startDate && {
            endAdornment: (
              <IconButton onClick={e => handleClrStartDate(e)}>
                <ClearIcon />
              </IconButton>
            ),
          }
        }
      />
      <DatePickerWrapper
        autoOk
        format="MMM dd, yyyy"
        id="end-date-picker"
        label="End Date"
        value={endDate}
        onChange={date => {
          const dateQuery = formatDateQuery(date)

          handleEndDateValueChange(dateQuery)
          addQueryStrings('sample_date_before', dateQuery)
        }}
        InputProps={
          endDate && {
            endAdornment: (
              <IconButton onClick={e => handleClrEndDate(e)}>
                <ClearIcon />
              </IconButton>
            ),
          }
        }
      />
    </MuiPickersUtilsProvider>
  )
}

DatePickerInputs.propTypes = {
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  handleStartDateValueChange: PropTypes.func.isRequired,
  handleEndDateValueChange: PropTypes.func.isRequired,
  addQueryStrings: PropTypes.func.isRequired,
}

DatePickerInputs.defaultProps = {
  startDate: null,
  endDate: null,
}

export default DatePickerInputs
