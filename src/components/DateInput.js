import React, { useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';

const dateInputStyles = makeStyles(theme => ({
  formStyle: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  textFieldStyle: {
    marginRight: 10
  }
}));

const DateInput = ({
  filterParams,
  addQueryStrings,
  startYearValidation,
  endYearValidation,
  checkStartYear,
  checkEndYear,
  checkEndYearGreater
}) => {
  const classes = dateInputStyles();
  const [dateMinVal, setDateMinVal] = useState(filterParams.date_min_after);
  const [dateMaxVal, setDateMaxVal] = useState(filterParams.date_max_before);
  const endYearGreaterThanStartYear =
    !startYearValidation &&
    !endYearValidation &&
    dateMaxVal.length > 0 &&
    dateMinVal.length > 0 &&
    dateMinVal > dateMaxVal;

  const dateValidation = endYearGreaterThanStartYear && (
    <FormHelperText id="year-validation-text">Start Year is greater than End Year</FormHelperText>
  );

  checkEndYearGreater(endYearGreaterThanStartYear);

  return (
    <>
      <FormControl error>
        <form className={classes.formStyle} noValidate autoComplete="off">
          <TextField
            error={startYearValidation}
            helperText={startYearValidation && 'Incorrect entry!'}
            id="start-year-input"
            label="Start year"
            value={dateMinVal}
            className={classes.textFieldStyle}
            onChange={event => {
              setDateMinVal(event.target.value);
              addQueryStrings('date_min_after', event.target.value);
              checkStartYear(event.target.value);
            }}
          />
          <TextField
            error={endYearValidation}
            helperText={endYearValidation && 'Incorrect entry!'}
            id="end-year-input"
            label="End year"
            value={dateMaxVal}
            onChange={event => {
              setDateMaxVal(event.target.value);
              addQueryStrings('date_max_before', event.target.value);
              checkEndYear(event.target.value);
            }}
          />
        </form>
        {dateValidation}
      </FormControl>
    </>
  );
};

export default DateInput;
