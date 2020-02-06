import React, { useState } from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
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

import AutocompleteFilter from './AutocompleteFilter';
import { simpleCountries } from '../constants/sample-data';

const AutocompleteInput = ({ filterParams, addQueryStrings }) => {
  return (
    <>
      <AutocompleteFilter
        id="country-filter"
        label="Country"
        options={simpleCountries}
        countryName={filterParams.country_name}
        addQueryStrings={addQueryStrings}
      />
    </>
  );
};

const FilterModal = ({ filterHandler, filterParams }) => {
  const [open, setOpen] = useState(false);
  const [queryStrings, setQueryStrings] = useState(filterParams);

  const addQueryStrings = (property, options) => {
    const params = { ...queryStrings };
    params[property] = options;
    setQueryStrings(params);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
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
        <ButtonStyle buttonBorder={true} setWiggle={true} onClick={handleClickOpen}>
          <FilterListIcon />
        </ButtonStyle>
      </Tooltip>
    </ThemeProvider>
  );

  return (
    <>
      {filterSites}
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <MuiDialogTitle>
          <DialogText dialogTitle={true}>Filter</DialogText>
        </MuiDialogTitle>
        <MuiDialogContent dividers>
          <AutocompleteInput filterParams={filterParams} addQueryStrings={addQueryStrings} />
        </MuiDialogContent>
        <MuiDialogActions>
          <Button onClick={handleClose} color="primary">
            Filter
          </Button>
        </MuiDialogActions>
      </Dialog>
    </>
  );
};

export default FilterModal;
