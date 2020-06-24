import React, { useState } from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import CircularProgress from '@material-ui/core/CircularProgress';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import { DialogText } from '../styles/MermaidStyledComponents';

import { ThemeProvider } from 'styled-components/macro';
import { ButtonStyle } from '../styles/MermaidStyledComponents';
import { theme } from './theme';
import Tooltip from '@material-ui/core/Tooltip';
import Fade from '@material-ui/core/Fade';
import FilterListIcon from '@material-ui/icons/FilterList';
import { makeStyles } from '@material-ui/core/styles';

import DateInput from './DateInput';
import AutocompleteInput from './AutocompleteInput';

const filterModalStyles = makeStyles(theme => ({
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -10,
    marginLeft: -10
  }
}));

const FilterModal = ({
  filterHandler,
  filterParams,
  filterChoices,
  showFilterNumbers,
  isFilteringChoices
}) => {
  const classes = filterModalStyles();
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
  const [startYearGreaterThanEndYear, setEndYearGreater] = useState(false);

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

  const convertToId = (names, filtered_options) => {
    const result = filtered_options.reduce((newArr, obj) => {
      if (names.includes(obj.name)) {
        newArr.push(obj.id);
      }
      return newArr;
    }, []);
    return result;
  };

  const addQueryStrings = (property, options) => {
    const params = { ...queryStrings };

    if (property === 'organization') {
      params[property] = convertToId(options, filterChoices.tags);
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
      <ButtonStyle
        disabled={isFilteringChoices}
        buttonBorder={!showFilterNumbers}
        filterButton={showFilterNumbers}
        setWiggle={true}
        onClick={handleClickOpen}
      >
        <Tooltip
          title="Filter Sites"
          placement="right"
          TransitionComponent={Fade}
          TransitionProps={{ timeout: 200 }}
        >
          {!isFilteringChoices ? (
            <FilterListIcon />
          ) : (
            <CircularProgress size={20} className={classes.buttonProgress} />
          )}
        </Tooltip>
      </ButtonStyle>
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
            disabled={startYearValidation || endYearValidation || startYearGreaterThanEndYear}
          >
            Done
          </Button>
        </MuiDialogActions>
      </Dialog>
    </>
  );
};

export default FilterModal;
