/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/no-array-index-key */

import PropTypes from 'prop-types'
import React from 'react'
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
  groupHeader: {
    position: 'sticky',
    top: '-8px',
    padding: '5px',
    backgroundColor: 'white',
    fontWeight: 800,
  },
  groupItems: {
    padding: 0,
  },
}))

const AutocompleteFilter = ({
  id,
  label,
  values,
  handleValuesChange,
  options,
  addQueryStrings,
}) => {
  const classes = useStyles()
  const optionGroupsCustomOrdered = options.sort((a, b) => {
    if (a.group.includes('projects') || b.group.includes('projects')) {
      return b.group.localeCompare(a.group)
    }

    return -b.group.localeCompare(a.group)
  })

  const handleValuesChangeAndUpdateQuery = (event, optionsValues) => {
    const optionLabels = optionsValues.map(option => option.label)

    handleValuesChange(optionsValues)
    addQueryStrings(id, optionLabels)
  }

  return (
    <div className={classes.root}>
      <Autocomplete
        multiple
        id={id}
        options={optionGroupsCustomOrdered}
        groupBy={option => option.group}
        value={values}
        getOptionLabel={option => option.label}
        filterSelectedOptions={true}
        onChange={handleValuesChangeAndUpdateQuery}
        renderInput={params => <TextField {...params} variant="outlined" label={label} fullWidth />}
        renderOption={(option, { inputValue }) => {
          const optionName = option.label
          const matches = match(optionName, inputValue, { insideWords: true })
          const parts = parse(optionName, matches)

          return (
            <div>
              {parts.map((part, index) => {
                return (
                  <span
                    key={`dropdown-filter-list-${part.text}-${index}`}
                    style={{ fontWeight: part.highlight ? 700 : 400 }}
                  >
                    {part.text}
                  </span>
                )
              })}
            </div>
          )
        }}
        renderGroup={({ key, group, children }) => (
          <li key={key}>
            <div className={classes.groupHeader}>{group}</div>
            <ul className={classes.groupItems}>{children}</ul>
          </li>
        )}
      />
    </div>
  )
}

AutocompleteFilter.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  values: PropTypes.arrayOf(PropTypes.shape({ label: PropTypes.string, group: PropTypes.string }))
    .isRequired,
  handleValuesChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({ label: PropTypes.string, group: PropTypes.string }))
    .isRequired,
  addQueryStrings: PropTypes.func.isRequired,
  arraySetOptions: PropTypes.arrayOf(PropTypes.string),
}

AutocompleteFilter.defaultProps = {
  arraySetOptions: [],
}

export default AutocompleteFilter
