/* eslint-disable react/jsx-props-no-spreading */
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

  return (
    <div className={classes.root}>
      <Autocomplete
        multiple
        id={id}
        options={options.sort((a, b) => -b.group.localeCompare(a.group))}
        groupBy={option => option.group}
        value={values}
        getOptionLabel={option => option.label}
        filterSelectedOptions={true}
        onChange={(event, optionsValues) => {
          const optionLabels = optionsValues.map(option => option.label)

          handleValuesChange(optionsValues)
          addQueryStrings(id, optionLabels)
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
            <div className={classes.groupHeader}>{params.group}</div>
            <ul className={classes.groupItems}>{params.children}</ul>
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
