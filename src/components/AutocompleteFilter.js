/* eslint-disable no-use-before-define */
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    width: 500,
    paddingBottom: 20,
    '& > * + *': {
      marginTop: theme.spacing(3)
    }
  }
}));

const AutocompleteFilter = ({ label, options }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Autocomplete
        multiple
        id="tags-outlined"
        options={options}
        getOptionLabel={option => option.label}
        filterSelectedOptions
        renderInput={params => <TextField {...params} variant="outlined" label={label} fullWidth />}
      />
    </div>
  );
};

export default AutocompleteFilter;
