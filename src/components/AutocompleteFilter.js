/* eslint-disable no-use-before-define */
import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    width: 'auto',
    paddingBottom: 20,
    '& > * + *': {
      marginTop: theme.spacing(3)
    }
  }
}));

const AutocompleteFilter = ({ id, label, options, preFilledValues, addQueryStrings }) => {
  const classes = useStyles();
  const [value, setValue] = useState(preFilledValues);

  return (
    <div className={classes.root}>
      <Autocomplete
        multiple
        id={id}
        options={options}
        value={value}
        onChange={(event, val) => {
          setValue(val);
          addQueryStrings(id, val);
        }}
        filterSelectedOptions
        renderInput={params => <TextField {...params} variant="outlined" label={label} fullWidth />}
      />
    </div>
  );
};

export default AutocompleteFilter;
