import React, { useState } from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import { DialogText } from '../styles/MermaidStyledComponents';
import { makeStyles } from '@material-ui/core/styles';

import { ThemeProvider } from 'styled-components/macro';
import { ButtonStyle } from '../styles/MermaidStyledComponents';
import { theme } from './theme';
import Tooltip from '@material-ui/core/Tooltip';
import Fade from '@material-ui/core/Fade';
import FilterListIcon from '@material-ui/icons/FilterList';

import AutocompleteFilter from './AutocompleteFilter';

const dateInputStyles = makeStyles(theme => ({
  formStyle: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  textFieldStyle: {
    marginRight: 10
  }
}));

const AutocompleteInput = ({ filterParams, addQueryStrings, filterChoices }) => {
  const country_names = filterChoices.countries.map(country => country.name);
  const project_names = filterChoices.projects.map(project => project.name);

  const convertToName = id => {
    const result = filterChoices.projects.reduce((newArr, obj) => {
      if (id.includes(obj.id)) {
        newArr.push(obj.name);
      }
      return newArr;
    }, []);
    return result;
  };

  return (
    <>
      <AutocompleteFilter
        id="country_name"
        label="Country"
        options={country_names}
        preFilledValues={filterParams.country_name}
        addQueryStrings={addQueryStrings}
      />
      <AutocompleteFilter
        id="project_id"
        label="Project"
        options={project_names}
        preFilledValues={convertToName(filterParams.project_id)}
        addQueryStrings={addQueryStrings}
      />
    </>
  );
};

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

const FilterModal = ({ filterHandler, filterParams, filterChoices, showFilterNumbers }) => {
  const isNumericAndEmpty = n => {
    if (n.length === 0) {
      return true;
    }
    return !isNaN(parseFloat(n)) && isFinite(n);
  };

  const [open, setOpen] = useState(false);
  const [queryStrings, setQueryStrings] = useState(filterParams);
  const [startYearValidation, setStartYearValidation] = useState(
    !isNumericAndEmpty(filterParams.date_min_after)
  );
  const [endYearValidation, setEndYearValidation] = useState(
    !isNumericAndEmpty(filterParams.date_max_before)
  );
  const [endYearGreater, setEndYearGreater] = useState(false);

  const checkStartYear = input => {
    if ((input.length === 4 || input.length === 0) && isNumericAndEmpty(input)) {
      setStartYearValidation(false);
    } else {
      setStartYearValidation(true);
    }
  };

  const checkEndYear = input => {
    if ((input.length === 4 || input.length === 0) && isNumericAndEmpty(input)) {
      setEndYearValidation(false);
    } else {
      setEndYearValidation(true);
    }
  };

  const checkEndYearGreater = option => {
    setEndYearGreater(option);
  };

  const convertToId = name => {
    const result = filterChoices.projects.reduce((newArr, obj) => {
      if (name.includes(obj.name)) {
        newArr.push(obj.id);
      }
      return newArr;
    }, []);
    return result;
  };

  const addQueryStrings = (property, options) => {
    const params = { ...queryStrings };

    if (property === 'project_id') {
      params[property] = convertToId(options);
    } else {
      params[property] = options;
    }
    setQueryStrings(params);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setStartYearValidation(false);
    setEndYearValidation(false);
  };

  const handleFilter = () => {
    setOpen(false);
    filterHandler(queryStrings);
  };

  const filterSites = (
    <ThemeProvider theme={theme.mapControl}>
      <Tooltip
        title="Filter Sites"
        placement="right"
        TransitionComponent={Fade}
        TransitionProps={{ timeout: 200 }}
      >
        <ButtonStyle
          buttonBorder={!showFilterNumbers}
          filterButton={showFilterNumbers}
          setWiggle={true}
          onClick={handleClickOpen}
        >
          <FilterListIcon />
        </ButtonStyle>
      </Tooltip>
    </ThemeProvider>
  );

  return (
    <>
      {filterSites}
      <Dialog open={open} aria-labelledby="form-dialog-title">
        <MuiDialogTitle>
          <DialogText dialogTitle={true}>Filter By</DialogText>
        </MuiDialogTitle>
        <MuiDialogContent dividers>
          <AutocompleteInput
            filterParams={filterParams}
            addQueryStrings={addQueryStrings}
            filterChoices={filterChoices}
          />
          <DateInput
            filterParams={filterParams}
            addQueryStrings={addQueryStrings}
            startYearValidation={startYearValidation}
            endYearValidation={endYearValidation}
            checkStartYear={checkStartYear}
            checkEndYear={checkEndYear}
            checkEndYearGreater={checkEndYearGreater}
          />
        </MuiDialogContent>
        <MuiDialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleFilter}
            color="primary"
            disabled={startYearValidation || endYearValidation || endYearGreater}
          >
            Done
          </Button>
        </MuiDialogActions>
      </Dialog>
    </>
  );
};

export default FilterModal;
