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
import CountryProjectOrganizationInputs from './CountryProjectOrganizationInputs'
import FilterSitesCountText from './FilterSitesCountText'
import MermaidDashboardTooltip from './MermaidDashboardTooltip'
import {
  filterChoicesPropType,
  filterParamsPropType,
  sitesPropType,
} from '../lib/mermaidDataPropTypes'

const filterModalStyles = makeStyles(() => ({
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -10,
    marginLeft: -10,
  },
}))

const FilterModal = ({
  filterHandler,
  filterParams,
  filterChoices,
  isFilteringChoices,
  allSites,
}) => {
  const classes = filterModalStyles()

  const [open, setOpen] = useState(false)
  const [queryStrings, setQueryStrings] = useState(filterParams)

  const [countryOptionValues, setCountryOptionValues] = useState([])
  const [projectOptionValues, setProjectOptionValues] = useState([])
  const [organizationOptionValues, setOrganizationOptionValues] = useState([])
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [isStartDateGreaterThanEndDate, setIsStartDateGreaterThanEndDate] = useState(false)

  const handleCountryOptionValuesChange = val => setCountryOptionValues(val)
  const handleProjectOptionValuesChange = val => setProjectOptionValues(val)
  const handleOrganizationOptionValuesChange = val => setOrganizationOptionValues(val)
  const handleStartDateValueChange = val => setStartDate(val)
  const handleEndDateValueChange = val => setEndDate(val)

  const _initializeOptionValues = useEffect(() => {
    if (filterParams.country) {
      const initialCountryValue = filterParams.country.map(countryParam => ({
        label: countryParam,
        group: '',
      }))

      setCountryOptionValues(initialCountryValue)
    }

    if (filterParams.project) {
      const initialProjectValue = filterParams.project.map(projectItem => ({
        label: projectItem,
        group: '',
      }))

      setProjectOptionValues(initialProjectValue)
    }

    if (filterParams.organization) {
      const initialOrganizationValue = filterParams.organization.map(organizationItem => ({
        label: organizationItem,
        group: '',
      }))

      setOrganizationOptionValues(initialOrganizationValue)
    }

    if (filterParams.sample_date_after) {
      setStartDate(filterParams.sample_date_after)
    }

    if (filterParams.sample_date_before) {
      setEndDate(filterParams.sample_date_before)
    }
  }, [filterParams])

  const _checkDateValidation = useEffect(() => {
    if (startDate && endDate) {
      const startDateTime = new Date(startDate).getTime()
      const endDateTime = new Date(endDate).getTime()

      setIsStartDateGreaterThanEndDate(startDateTime > endDateTime)
    } else {
      setIsStartDateGreaterThanEndDate(false)
    }
  }, [endDate, startDate])

  const addQueryStrings = (property, options) => {
    const params = {
      ...queryStrings,
    }

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
          <FilterSitesCountText
            allSites={allSites}
            countryOptionValues={countryOptionValues}
            projectOptionValues={projectOptionValues}
            organizationOptionValues={organizationOptionValues}
            startDate={startDate}
            endDate={endDate}
          />
          <CountryProjectOrganizationInputs
            allSites={allSites}
            countryOptionValues={countryOptionValues}
            projectOptionValues={projectOptionValues}
            organizationOptionValues={organizationOptionValues}
            handleCountryOptionValuesChange={handleCountryOptionValuesChange}
            handleProjectOptionValuesChange={handleProjectOptionValuesChange}
            handleOrganizationOptionValuesChange={handleOrganizationOptionValuesChange}
            addQueryStrings={addQueryStrings}
            filterChoices={filterChoices}
          />
          <DatePickerInputs
            startDate={startDate}
            endDate={endDate}
            handleStartDateValueChange={handleStartDateValueChange}
            handleEndDateValueChange={handleEndDateValueChange}
            addQueryStrings={addQueryStrings}
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
  allSites: sitesPropType.isRequired,
}

export default FilterModal
