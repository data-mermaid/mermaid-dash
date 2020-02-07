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

const FilterModal = ({ filterHandler, filterParams, filterChoices }) => {
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
          <AutocompleteInput
            filterParams={filterParams}
            addQueryStrings={addQueryStrings}
            filterChoices={filterChoices}
          />
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
