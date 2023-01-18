import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'

import { ThemeProvider } from 'styled-components/macro'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import CircularProgress from '@material-ui/core/CircularProgress'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import MuiDialogContent from '@material-ui/core/DialogContent'
import MuiDialogActions from '@material-ui/core/DialogActions'
import FilterListIcon from '@material-ui/icons/FilterList'
import { makeStyles } from '@material-ui/core/styles'

import { theme } from '../constants/theme'
import { ButtonStyle, DialogTitle } from '../styles/MermaidStyledComponents'
import DatePickerInputs from './DatePickerInputs'
import AutocompleteInput from './AutocompleteInput'
import MermaidDashboardTooltip from './MermaidDashboardTooltip'
import { filterChoicesPropType, filterParamsPropType } from '../lib/mermaidDataPropTypes'

const filterModalStyles = makeStyles(() => ({
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -10,
    marginLeft: -10,
  },
}))

const FilterModal = ({ filterHandler, filterParams, filterChoices, isFilteringChoices }) => {
  const classes = filterModalStyles()

  const [open, setOpen] = useState(false)
  const [queryStrings, setQueryStrings] = useState(filterParams)
  const [isStartDateGreaterThanEndDate, setIsStartDateGreaterThanEndDate] = useState(false)

  useEffect(() => {
    const { sample_date_after, sample_date_before } = filterParams

    if (sample_date_after && sample_date_before) {
      const sampleDateAfter = new Date(sample_date_after).getTime()
      const sampleDateBefore = new Date(sample_date_before).getTime()

      setIsStartDateGreaterThanEndDate(sampleDateAfter > sampleDateBefore)
    }
  }, [filterParams])
  const addQueryStrings = (property, options) => {
    const params = { ...queryStrings }

    params[property] = options

    setQueryStrings(params)
  }

  const handleClickOpen = () => setOpen(true)

  const handleClose = () => {
    setOpen(false)
  }

  const handleFilter = () => {
    setOpen(false)

    filterHandler(queryStrings)
  }

  const setDateValidation = value => setIsStartDateGreaterThanEndDate(value)

  const filterSites = (
    <ThemeProvider theme={theme.mapControl}>
      <ButtonStyle disabled={isFilteringChoices} setWiggle onClick={handleClickOpen}>
        <MermaidDashboardTooltip title="Filter Sites" placement="right">
          {!isFilteringChoices ? (
            <FilterListIcon />
          ) : (
            <CircularProgress size={20} className={classes.buttonProgress} />
          )}
        </MermaidDashboardTooltip>
      </ButtonStyle>
    </ThemeProvider>
  )

  return (
    <>
      {filterSites}
      <Dialog open={open} aria-labelledby="form-dialog-title">
        <MuiDialogTitle>
          <DialogTitle>Filter By</DialogTitle>
        </MuiDialogTitle>
        <MuiDialogContent dividers>
          <AutocompleteInput
            filterParams={filterParams}
            addQueryStrings={addQueryStrings}
            filterChoices={filterChoices}
          />
          <DatePickerInputs
            filterParams={filterParams}
            addQueryStrings={addQueryStrings}
            setDateValidation={setDateValidation}
          />
          {isStartDateGreaterThanEndDate && (
            <Typography variant="caption" color="error">
              Start date is greater than end date!
            </Typography>
          )}
        </MuiDialogContent>
        <MuiDialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleFilter} color="primary" disabled={isStartDateGreaterThanEndDate}>
            Apply
          </Button>
        </MuiDialogActions>
      </Dialog>
    </>
  )
}

FilterModal.propTypes = {
  filterHandler: PropTypes.func.isRequired,
  filterParams: filterParamsPropType.isRequired,
  filterChoices: filterChoicesPropType.isRequired,
  isFilteringChoices: PropTypes.bool.isRequired,
}

export default FilterModal
