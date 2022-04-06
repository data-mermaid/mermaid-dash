import React, { useState } from 'react';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';

const formatDateQuery = date => {
  const year = date?.getFullYear();
  const month = date?.getMonth() + 1;
  const day = date?.getDate();

  return year || month || day ? `${year}-${month}-${day}` : null;
};

const DatePickerInputs = ({ filterParams, addQueryStrings }) => {
  const [startDate, setStateDate] = useState(filterParams.sample_date_after || null);
  const [endDate, setEndDate] = useState(filterParams.sample_date_before || null);

  function handleClrStartDate(e) {
    e.stopPropagation();
    setStateDate(null);
    addQueryStrings('sample_date_after', '');
  }
  function handleClrEndDate(e) {
    e.stopPropagation();
    setEndDate(null);
    addQueryStrings('sample_date_before', '');
  }

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <div>
        <DatePicker
          autoOk
          format="MMM dd, yyyy"
          id="start-date-picker"
          label="Start Date"
          value={startDate}
          views={['year', 'month', 'date']}
          onChange={date => {
            const dateQuery = formatDateQuery(date);
            console.log('on accept');
            setStateDate(date);
            addQueryStrings('sample_date_after', dateQuery);
          }}
        />
        {startDate && (
          <IconButton onClick={e => handleClrStartDate(e)}>
            <ClearIcon />
          </IconButton>
        )}
      </div>
      <div>
        <DatePicker
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
        />
        {endDate && (
          <IconButton onClick={e => handleClrEndDate(e)}>
            <ClearIcon />
          </IconButton>
        )}
      </div>
    </MuiPickersUtilsProvider>
  );
};

export default DatePickerInputs;
