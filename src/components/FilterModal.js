import React, { useState } from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
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

const useStyles = makeStyles(theme => ({
  root: {
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

const DateInput = ({ filterParams, addQueryStrings }) => {
  const classes = useStyles();
  const [dateMinVal, setDateMinVal] = useState(filterParams.date_min_after);
  const [dateMaxVal, setDateMaxVal] = useState(filterParams.date_max_before);

  return (
    <form className={classes.root} noValidate autoComplete="off">
      <TextField
        id="start-year-input"
        label="Start year"
        value={dateMinVal}
        className={classes.textFieldStyle}
        onChange={event => {
          setDateMinVal(event.target.value);
          addQueryStrings('date_min_after', event.target.value);
        }}
      />
      <TextField
        id="end-year-input"
        label="End year"
        value={dateMaxVal}
        onChange={event => {
          setDateMaxVal(event.target.value);
          addQueryStrings('date_max_before', event.target.value);
        }}
      />
    </form>
  );
};

const FilterModal = ({ filterHandler, filterParams, filterChoices, showFilterNumbers }) => {
  const [open, setOpen] = useState(false);
  const [queryStrings, setQueryStrings] = useState(filterParams);

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
          <DateInput filterParams={filterParams} addQueryStrings={addQueryStrings} />
        </MuiDialogContent>
        <MuiDialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleFilter} color="primary">
            Done
          </Button>
        </MuiDialogActions>
      </Dialog>
    </>
  );
};

export default FilterModal;
