/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from 'prop-types'
import React from 'react'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'
import parse from 'autosuggest-highlight/parse'
import match from 'autosuggest-highlight/match'
import { makeStyles } from '@material-ui/core/styles'
import styled from 'styled-components'

const useStyles = makeStyles(theme => ({
  root: {
    width: 'auto',
    paddingBottom: 20,
    '& > * + *': {
      marginTop: theme.spacing(3),
    },
  },
}))

const GroupHeader = styled('div')`
  padding: 4px 10px;
  font-weight: 700;
`

const GroupItems = styled('ul')`
  padding: 0;
`

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
        options={options.sort((a, b) => -b.isMatch.localeCompare(a.isMatch))}
        groupBy={option => option.isMatch}
        value={testValue}
        getOptionLabel={option => option.label}
        filterSelectedOptions={true}
        onChange={(event, val) => {
          const valForQuerying = val.map(item => item.label)

          handleValueChange(val)
          addQueryStrings(id, valForQuerying)
        }}
        renderInput={params => <TextField {...params} variant="outlined" label={label} fullWidth />}
        renderOption={(option, { inputValue }) => {
          const optionName = option.label
          const matches = match(optionName, inputValue)
          const parts = parse(optionName, matches)

          return (
            <div>
              {parts.map(part => {
                return (
                  <span
                    key={`dropdown-filter-list-${part.text}`}
                    style={{ fontWeight: part.highlight ? 700 : 350 }}
                  >
                    {part.text}
                  </span>
                )
              })}
            </div>
          )
        }}
        renderGroup={params => (
          <li key={params.key}>
            <GroupHeader>{params.group}</GroupHeader>
            <GroupItems>{params.children}</GroupItems>
          </li>
        )}
      />
    </div>
  )
}

AutocompleteFilter.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  testValue: PropTypes.arrayOf(
    PropTypes.shape({ label: PropTypes.string, isMatch: PropTypes.string }),
  ).isRequired,
  handleValueChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({ label: PropTypes.string, isMatch: PropTypes.string }),
  ).isRequired,
  addQueryStrings: PropTypes.func.isRequired,
  arraySetOptions: PropTypes.arrayOf(PropTypes.string),
}

AutocompleteFilter.defaultProps = {
  arraySetOptions: [],
}

export default AutocompleteFilter
