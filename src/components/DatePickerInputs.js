import React, { useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';

const DatePickerWrapper = styled(DatePicker)`
  width: 100%;
`;
const formatDateQuery = date => {
  const year = date?.getFullYear();
  const month = date?.getMonth() + 1;
  const day = date?.getDate();

  return year || month || day ? `${year}-${month}-${day}` : null;
};

const DatePickerInputs = ({ filterParams, addQueryStrings, setDateValidation }) => {
  const [startDate, setStateDate] = useState(filterParams.sample_date_after || null);
  const [endDate, setEndDate] = useState(filterParams.sample_date_before || null);

  useEffect(() => {
    if (startDate && endDate) {
      const startDateTime = new Date(startDate).getTime();
      const endDateTime = new Date(endDate).getTime();
      setDateValidation(startDateTime > endDateTime);
    } else {
      setDateValidation(false);
    }
  }, [endDate, setDateValidation, startDate]);

  const handleClrStartDate = e => {
    e.stopPropagation();
    setStateDate(null);
    addQueryStrings('sample_date_after', '');
  };

  const handleClrEndDate = e => {
    e.stopPropagation();
    setEndDate(null);
    addQueryStrings('sample_date_before', '');
  };

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <DatePickerWrapper
        autoOk
        format="MMM dd, yyyy"
        id="start-date-picker"
        label="Start Date"
        value={startDate}
        onChange={date => {
          const dateQuery = formatDateQuery(date);
          setStateDate(date);
          addQueryStrings('sample_date_after', dateQuery);
        }}
        InputProps={
          startDate && {
            endAdornment: (
              <IconButton onClick={e => handleClrStartDate(e)}>
                <ClearIcon />
              </IconButton>
            )
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
          const dateQuery = formatDateQuery(date);
          setEndDate(date);
          addQueryStrings('sample_date_before', dateQuery);
        }}
        InputProps={
          endDate && {
            endAdornment: (
              <IconButton onClick={e => handleClrEndDate(e)}>
                <ClearIcon />
              </IconButton>
            )
          }
        }
      />
    </MuiPickersUtilsProvider>
  );
};

export default DatePickerInputs;
