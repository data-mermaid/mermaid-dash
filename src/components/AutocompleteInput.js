import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'

import AutocompleteFilter from './AutocompleteFilter'
import { sortArray } from '../lib/array-helpers'
import {
  dropdownOptionsPropType,
  filterChoicesPropType,
  sitesPropType,
} from '../lib/mermaidDataPropTypes'
import usePrevious from '../lib/usePrevious'

const AutocompleteInput = ({
  sites,
  countryValue,
  projectValue,
  organizationValue,
  handleCountryValueChange,
  handleProjectValueChange,
  handleOrganizationValueChange,
  addQueryStrings,
  filterChoices,
}) => {
  const { countries, projects, tags } = filterChoices
  const country_names = sortArray(countries, 'name')
  const project_names = sortArray(projects, 'name')
  const tag_names = sortArray(tags, 'name')

  const previousCountryValue = usePrevious(countryValue)
  const previousProjectValue = usePrevious(projectValue)
  const previousOrganizationValue = usePrevious(organizationValue)

  const [countryOptions, setCountryOptions] = useState([])
  const [projectOptions, setProjectOptions] = useState([])
  const [organizationOptions, setOrganizationOptions] = useState([])

  const _updateCountryOptions = useEffect(() => {
    if (
      !previousProjectValue ||
      projectValue.length !== previousProjectValue.length ||
      !previousOrganizationValue ||
      organizationValue.length !== previousOrganizationValue.length
    ) {
      const allSites = sites.map(site => site[1]).flat()
      const filterSitesByProject = allSites.filter(aSites => {
        const projectValueLabels = projectValue.map(({ label }) => label)
        const organizationValueLabels = organizationValue.map(({ label }) => label)

        return (
          projectValueLabels.includes(aSites.project_name) ||
          (aSites.tags !== null &&
            aSites.tags
              .map(({ name }) => name)
              .findIndex(item => organizationValueLabels.includes(item)) !== -1)
        )
      })

      const countryNameSites = filterSitesByProject.map(({ country_name }) => country_name)
      const countrySetOptions = [...new Set(countryNameSites)]

      const groupedByCountryNames = countrySetOptions.length
        ? country_names.map(cName => {
            return {
              label: cName,
              isMatch: countrySetOptions.includes(cName)
                ? 'Countries based on other filters'
                : 'Countries without filters',
            }
          })
        : country_names.map(cName => {
            return {
              label: cName,
              isMatch: '',
            }
          })

      setCountryOptions(groupedByCountryNames)
    }
  }, [
    sites,
    previousProjectValue,
    previousOrganizationValue,
    projectValue,
    organizationValue,
    country_names,
  ])

  const _updateProjectOptions = useEffect(() => {
    if (
      !previousCountryValue ||
      countryValue.length !== previousCountryValue.length ||
      !previousOrganizationValue ||
      organizationValue.length !== previousOrganizationValue.length
    ) {
      const allSites = sites.map(site => site[1]).flat()
      const filterSitesByCountry = allSites.filter(aSites => {
        const countryValueLabels = countryValue.map(({ label }) => label)
        const organizationValueLabels = organizationValue.map(({ label }) => label)

        return (
          countryValueLabels.includes(aSites.country_name) ||
          (aSites.tags !== null &&
            aSites.tags
              .map(({ name }) => name)
              .findIndex(item => organizationValueLabels.includes(item)) !== -1)
        )
      })

      const projectNameSites = filterSitesByCountry.map(({ project_name }) => project_name)
      const projectSetOptions = [...new Set(projectNameSites)]
      const groupedByProjectNames = projectSetOptions.length
        ? project_names.map(pName => {
            return {
              label: pName,
              isMatch: projectSetOptions.includes(pName)
                ? 'Projects based on other filters'
                : 'Projects without filters',
            }
          })
        : project_names.map(pName => {
            return {
              label: pName,
              isMatch: '',
            }
          })

      setProjectOptions(groupedByProjectNames)
    }
  }, [
    previousCountryValue,
    previousOrganizationValue,
    countryValue,
    organizationValue,
    sites,
    project_names,
  ])

  const _updateOrganizationOptions = useEffect(() => {
    if (
      !previousCountryValue ||
      countryValue.length !== previousCountryValue.length ||
      !previousProjectValue ||
      projectValue.length !== previousProjectValue.length
    ) {
      const allSites = sites.map(site => site[1]).flat()
      const filterSitesByCountry = allSites.filter(aSites => {
        const countryValueLabels = countryValue.map(({ label }) => label)
        const projectValueLabels = projectValue.map(({ label }) => label)

        return (
          countryValueLabels.includes(aSites.country_name) ||
          projectValueLabels.includes(aSites.project_name)
        )
      })

      const tagNameSites = filterSitesByCountry
        .map(({ tags: organizations }) => organizations)
        .flat()
      const tagNamesOnly = tagNameSites
        .filter(organization => organization !== null)
        .map(({ name }) => name)
      const tagSetOptions = [...new Set(tagNamesOnly)]
      const groupedByOrganizationNames = tagSetOptions.length
        ? tag_names.map(tName => {
            return {
              label: tName,
              isMatch: tagSetOptions.includes(tName)
                ? 'Organizations based on other filters'
                : 'Organizations without filters',
            }
          })
        : tag_names.map(tName => {
            return {
              label: tName,
              isMatch: '',
            }
          })

      setOrganizationOptions(groupedByOrganizationNames)
    }
  }, [
    previousCountryValue,
    previousProjectValue,
    countryValue,
    projectValue,
    project_names,
    tag_names,
    sites,
  ])

  return (
    <>
      <AutocompleteFilter
        id="country"
        label="Country"
        testValue={countryValue}
        handleValueChange={handleCountryValueChange}
        autocompleteValue={countryValue}
        options={countryOptions}
        addQueryStrings={addQueryStrings}
      />
      <AutocompleteFilter
        id="project"
        label="Project"
        testValue={projectValue}
        handleValueChange={handleProjectValueChange}
        options={projectOptions}
        addQueryStrings={addQueryStrings}
      />
      <AutocompleteFilter
        id="organization"
        label="Organization"
        testValue={organizationValue}
        handleValueChange={handleOrganizationValueChange}
        options={organizationOptions}
        addQueryStrings={addQueryStrings}
      />
    </>
  )
}

AutocompleteInput.propTypes = {
  sites: sitesPropType.isRequired,
  countryValue: dropdownOptionsPropType.isRequired,
  projectValue: dropdownOptionsPropType.isRequired,
  organizationValue: dropdownOptionsPropType.isRequired,
  handleCountryValueChange: PropTypes.func.isRequired,
  handleProjectValueChange: PropTypes.func.isRequired,
  handleOrganizationValueChange: PropTypes.func.isRequired,
  addQueryStrings: PropTypes.func.isRequired,
  filterChoices: filterChoicesPropType.isRequired,
}

export default AutocompleteInput
