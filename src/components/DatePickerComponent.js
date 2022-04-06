import React, { useState } from 'react';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';

const formatDateQuery = date => {
  const year = date?.getFullYear();
  const month = date?.getMonth() + 1;
  const day = date?.getDate();

  return year || month || day ? `${year}-${month}-${day}` : null;
};

const DatePickerComponent = ({ filterParams, addQueryStrings }) => {
  console.log('filterParams ', filterParams);
  const [startDate, setStateDate] = useState(filterParams.sample_date_after || null);
  const [endDate, setEndDate] = useState(filterParams.sample_date_before || null);

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <DatePicker
        autoOk
        format="MMM dd, yyyy"
        id="start-date-picker"
        label="Start Date"
        value={startDate}
        views={['year', 'month', 'date']}
        onChange={date => {
          console.log('Start date event value ', date);
          const dateQuery = formatDateQuery(date);
          setStateDate(date);
          addQueryStrings('sample_date_after', dateQuery);
        }}
      />
      <DatePicker
        autoOk
        format="MMM dd, yyyy"
        id="end-date-picker"
        label="End Date"
        value={endDate}
        onChange={date => {
          console.log('End date event value ', date);
          const dateQuery = formatDateQuery(date);
          setEndDate(date);
          addQueryStrings('sample_date_before', dateQuery);
        }}
      />
    </MuiPickersUtilsProvider>
  );
};

export default DatePickerComponent;
