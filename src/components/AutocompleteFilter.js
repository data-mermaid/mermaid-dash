/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'
import parse from 'autosuggest-highlight/parse'
import match from 'autosuggest-highlight/match'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  root: {
    width: 'auto',
    paddingBottom: 20,
    '& > * + *': {
      marginTop: theme.spacing(3),
    },
  },
}))

const AutocompleteFilter = ({
  id,
  label,
  testValue,
  handleValueChange,
  options,
  addQueryStrings,
}) => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Autocomplete
        multiple
        id={id}
        options={options}
        value={testValue}
        getOptionLabel={option => option.label}
        onChange={(event, val) => {
          console.log('on change val ', val)
          const updatedVal = val.map(item => ({ label: item, isMatch: false }))
          handleValueChange(updatedVal)
          addQueryStrings(id, val)
        }}
        filterSelectedOptions
        renderInput={params => <TextField {...params} variant="outlined" label={label} fullWidth />}
        // renderOption={(option, { inputValue }) => {
        //   const optionLabel = option.label
        //   const matches = match(optionLabel, inputValue)
        //   const parts = parse(optionLabel, matches)

        //   return (
        //     <div>
        //       {parts.map(part => {
        //         return (
        //           <span
        //             key={`dropdown-filter-list-${part.text}`}
        //             style={{ fontWeight: part.highlight ? 700 : 400 }}
        //           >
        //             {part.text}
        //           </span>
        //         )
        //       })}
        //     </div>
        //   )
        // }}
      />
    </div>
  )
}

AutocompleteFilter.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  testValue: PropTypes.arrayOf(
    PropTypes.shape({ label: PropTypes.string, isMatch: PropTypes.bool }),
  ).isRequired,
  handleValueChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  addQueryStrings: PropTypes.func.isRequired,
}

export default AutocompleteFilter
