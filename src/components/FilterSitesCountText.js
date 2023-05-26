import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'

import styled from 'styled-components'
import { getSitesGroupBySampleEvents } from '../lib/array-helpers'
import { dropdownOptionsPropType, sitesPropType } from '../lib/mermaidDataPropTypes'

const FilteredText = styled('div')`
  padding-bottom: 10px;
`

const FilterSitesCountText = ({
  allSites,
  countryOptionValues,
  projectOptionValues,
  organizationOptionValues,
  startDate,
  endDate,
}) => {
  const [filteredSitesCount, setFilteredSitesCount] = useState(0)

  const _updateFilteredSitesCount = useEffect(() => {
    const sampleEvents = allSites.map(site => site[1]).flat()
    const startDateTime = new Date(startDate).getTime()
    const endDateTime = new Date(endDate).getTime()
    const countryOptionLabels = countryOptionValues.map(({ label }) => label)
    const projectOptionLabels = projectOptionValues.map(({ label }) => label)
    const organizationOptionLabels = organizationOptionValues.map(({ label }) => label)

    const allFiltersSelected =
      countryOptionLabels.length && projectOptionLabels.length && organizationOptionLabels.length
    const oneOfFiltersSelected =
      countryOptionLabels.length || projectOptionLabels.length || organizationOptionLabels.length
    const noneOfFiltersSelected =
      !countryOptionLabels.length && !projectOptionLabels.length && !organizationOptionLabels.length
    const countryAndProjectFiltersSelected =
      countryOptionLabels.length && projectOptionLabels.length && !organizationOptionLabels.length
    const countryAndOrganizationFiltersSelected =
      countryOptionLabels.length && !projectOptionLabels.length && organizationOptionLabels.length
    const projectAndOrganizationFiltersSelected =
      !countryOptionLabels.length && projectOptionLabels.length && organizationOptionLabels.length

    const filteredSitesByAutocompleteInputs = sampleEvents.filter(sample_event => {
      const { country_name, project_name, tags } = sample_event
      const countryIncludedInCountryOptions = countryOptionLabels.includes(country_name)
      const projectIncludedInProjectOptions = projectOptionLabels.includes(project_name)
      const organizationIncludedInOrganizationOptions =
        tags !== null &&
        tags.map(({ name }) => name).findIndex(item => organizationOptionLabels.includes(item)) !==
          -1

      if (allFiltersSelected) {
        return (
          countryIncludedInCountryOptions &&
          projectIncludedInProjectOptions &&
          organizationIncludedInOrganizationOptions
        )
      }

      if (countryAndProjectFiltersSelected) {
        return countryIncludedInCountryOptions && projectIncludedInProjectOptions
      }

      if (countryAndOrganizationFiltersSelected) {
        return countryIncludedInCountryOptions && organizationIncludedInOrganizationOptions
      }

      if (projectAndOrganizationFiltersSelected) {
        return projectIncludedInProjectOptions && organizationIncludedInOrganizationOptions
      }

      if (oneOfFiltersSelected) {
        return (
          countryIncludedInCountryOptions ||
          projectIncludedInProjectOptions ||
          organizationIncludedInOrganizationOptions
        )
      }

      return noneOfFiltersSelected
    })

    const filteredSitesByDate = filteredSitesByAutocompleteInputs.filter(site => {
      const siteDateTime = new Date(site.sample_date).getTime()

      if (!startDate && !endDate) {
        return true
      }

      if (startDate && endDate) {
        return startDateTime <= siteDateTime && siteDateTime <= endDateTime
      }

      return (
        (startDate && startDateTime <= siteDateTime) || (endDate && siteDateTime <= endDateTime)
      )
    })

    const sitesGroupedBySampleEventName = getSitesGroupBySampleEvents(filteredSitesByDate)

    setFilteredSitesCount(sitesGroupedBySampleEventName.length)
  }, [
    allSites,
    countryOptionValues,
    projectOptionValues,
    organizationOptionValues,
    startDate,
    endDate,
  ])

  return allSites.length === filteredSitesCount ? (
    <FilteredText>
      <strong>Showing all sites</strong>
    </FilteredText>
  ) : (
    <FilteredText>
      Showing <strong>{filteredSitesCount}</strong> of <strong>{allSites.length}</strong> sites
      based on these filters
    </FilteredText>
  )
}

FilterSitesCountText.propTypes = {
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  allSites: sitesPropType.isRequired,
  countryOptionValues: dropdownOptionsPropType.isRequired,
  projectOptionValues: dropdownOptionsPropType.isRequired,
  organizationOptionValues: dropdownOptionsPropType.isRequired,
}

FilterSitesCountText.defaultProps = {
  startDate: null,
  endDate: null,
}

export default FilterSitesCountText
