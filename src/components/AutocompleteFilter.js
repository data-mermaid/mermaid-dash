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

const AutocompleteFilter = ({ id, label, options, preFilledValues, addQueryStrings }) => {
  const classes = useStyles()
  const [value, setValue] = useState(preFilledValues)

  return (
    <div className={classes.root}>
      <Autocomplete
        multiple
        id={id}
        options={options}
        value={value}
        onChange={(event, val) => {
          setValue(val)
          addQueryStrings(id, val)
        }}
        filterSelectedOptions
        renderInput={params => <TextField {...params} variant="outlined" label={label} fullWidth />}
        renderOption={(option, { inputValue }) => {
          const matches = match(option, inputValue)
          const parts = parse(option, matches)

          return (
            <div>
              {parts.map(part => {
                return (
                  <span
                    key={`dropdown-filter-list-${part.text}`}
                    style={{ fontWeight: part.highlight ? 700 : 400 }}
                  >
                    {part.text}
                  </span>
                )
              })}
            </div>
          )
        }}
      />
    </div>
  )
}

AutocompleteFilter.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  preFilledValues: PropTypes.arrayOf(PropTypes.string).isRequired,
  addQueryStrings: PropTypes.func.isRequired,
}

export default AutocompleteFilter
