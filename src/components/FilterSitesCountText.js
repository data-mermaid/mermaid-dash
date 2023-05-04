import React, { useState, useEffect } from 'react'

import styled from 'styled-components'
import { getSitesGroupByName } from '../lib/array-helpers'
import { dropdownOptionsPropType, sitesPropType } from '../lib/mermaidDataPropTypes'

const FilteredText = styled('div')`
  padding-bottom: 10px;
`

const FilterSitesCountText = ({
  sites,
  countryValue,
  projectValue,
  organizationValue,
  startDate,
  endDate,
}) => {
  const [filteredSitesCount, setFilteredSitesCount] = useState(0)

  const _updateFilteredSitesCount = useEffect(() => {
    const allSites = sites.map(site => site[1]).flat()
    const startDateTime = new Date(startDate).getTime()
    const endDateTime = new Date(endDate).getTime()
    const countryValueLabels = countryValue.map(({ label }) => label)
    const projectValueLabels = projectValue.map(({ label }) => label)
    const organizationValueLabels = organizationValue.map(({ label }) => label)

    const allFiltersSelected =
      countryValueLabels.length && projectValueLabels.length && organizationValueLabels.length
    const oneOfFilteredSelected =
      countryValueLabels.length || projectValueLabels.length || organizationValueLabels.length
    const noneOfFiltersSelected =
      !countryValueLabels.length && !projectValueLabels.length && !organizationValueLabels.length
    const countryAndProjectFiltersSelected =
      countryValueLabels.length && projectValueLabels.length && !organizationValueLabels.length
    const countryAndOrganizationFiltersSelected =
      countryValueLabels.length && !projectValueLabels.length && organizationValueLabels.length
    const projectAndOrganizationFiltersSelected =
      !countryValueLabels.length && projectValueLabels.length && organizationValueLabels.length

    const filteredSitesByAutocompleteInputs = allSites.filter(sites => {
      if (allFiltersSelected) {
        return (
          countryValueLabels.includes(sites.country_name) &&
          projectValueLabels.includes(sites.project_name) &&
          sites.tags !== null &&
          sites.tags
            .map(({ name }) => name)
            .findIndex(item => organizationValueLabels.includes(item)) !== -1
        )
      }
      if (noneOfFiltersSelected) {
        return true
      }
      if (countryAndProjectFiltersSelected) {
        return (
          countryValueLabels.includes(sites.country_name) &&
          projectValueLabels.includes(sites.project_name)
        )
      }
      if (countryAndOrganizationFiltersSelected) {
        return (
          countryValueLabels.includes(sites.country_name) &&
          sites.tags !== null &&
          sites.tags
            .map(({ name }) => name)
            .findIndex(item => organizationValueLabels.includes(item)) !== -1
        )
      }
      if (projectAndOrganizationFiltersSelected) {
        return (
          projectValueLabels.includes(sites.project_name) &&
          sites.tags !== null &&
          sites.tags
            .map(({ name }) => name)
            .findIndex(item => organizationValueLabels.includes(item)) !== -1
        )
      }
      if (oneOfFilteredSelected) {
        return (
          countryValueLabels.includes(sites.country_name) ||
          projectValueLabels.includes(sites.project_name) ||
          (sites.tags !== null &&
            sites.tags
              .map(({ name }) => name)
              .findIndex(item => organizationValueLabels.includes(item)) !== -1)
        )
      }
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

    const sitesGroupedBySampleEventName = getSitesGroupByName(filteredSitesByDate)

    setFilteredSitesCount(sitesGroupedBySampleEventName.length)
  }, [sites, countryValue, projectValue, startDate, endDate, organizationValue])

  return sites.length === filteredSitesCount ? (
    <FilteredText>Show all sites</FilteredText>
  ) : (
    <FilteredText>
      Showing <strong>{filteredSitesCount}</strong> of <strong>{sites.length}</strong> sites based
      on these filters
    </FilteredText>
  )
}

FilterSitesCountText.propTypes = {
  sites: sitesPropType.isRequired,
  countryValue: dropdownOptionsPropType.isRequired,
  projectValue: dropdownOptionsPropType.isRequired,
  organizationValue: dropdownOptionsPropType.isRequired,
}

export default FilterSitesCountText
