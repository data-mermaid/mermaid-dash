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

const CountryProjectOrganizationInputs = ({
  allSites,
  countryOptionValues,
  projectOptionValues,
  organizationOptionValues,
  handleCountryOptionValuesChange,
  handleProjectOptionValuesChange,
  handleOrganizationOptionValuesChange,
  addQueryStrings,
  filterChoices,
}) => {
  const { countries, projects, tags } = filterChoices
  const country_names = sortArray(countries, 'name')
  const project_names = sortArray(projects, 'name')
  const organization_names = sortArray(tags, 'name')

  const previousCountryOptionValues = usePrevious(countryOptionValues)
  const previousProjectOptionValues = usePrevious(projectOptionValues)
  const previousOrganizationOptionValues = usePrevious(organizationOptionValues)

  const [countryOptions, setCountryOptions] = useState([])
  const [projectOptions, setProjectOptions] = useState([])
  const [organizationOptions, setOrganizationOptions] = useState([])

  const _updateCountryOptions = useEffect(() => {
    if (
      !previousProjectOptionValues ||
      projectOptionValues.length !== previousProjectOptionValues.length ||
      !previousOrganizationOptionValues ||
      organizationOptionValues.length !== previousOrganizationOptionValues.length
    ) {
      const sampleEvents = allSites.map(site => site[1]).flat()
      const filteredSitesByProjectsAndOrganizations = sampleEvents.filter(sample_event => {
        const { project_name, tags: organizations } = sample_event
        const projectOptionLabels = projectOptionValues.map(({ label }) => label)
        const organizationOptionLabels = organizationOptionValues.map(({ label }) => label)

        return (
          projectOptionLabels.includes(project_name) ||
          (organizations !== null &&
            organizations
              .map(({ name }) => name)
              .findIndex(item => organizationOptionLabels.includes(item)) !== -1)
        )
      })

      const countriesInFilteredSites = filteredSitesByProjectsAndOrganizations.map(
        ({ country_name }) => country_name,
      )
      const uniqueCountries = [...new Set(countriesInFilteredSites)]

      const updatedCountryOptions = uniqueCountries.length
        ? country_names.map(country_name => {
            return {
              label: country_name,
              group: uniqueCountries.includes(country_name)
                ? 'Countries based on current filters'
                : 'Other countries',
            }
          })
        : country_names.map(country_name => {
            return {
              label: country_name,
              group: '',
            }
          })

      setCountryOptions(updatedCountryOptions)
    }
  }, [
    allSites,
    projectOptionValues,
    organizationOptionValues,
    previousProjectOptionValues,
    previousOrganizationOptionValues,
    country_names,
  ])

  const _updateProjectOptions = useEffect(() => {
    if (
      !previousCountryOptionValues ||
      countryOptionValues.length !== previousCountryOptionValues.length ||
      !previousOrganizationOptionValues ||
      organizationOptionValues.length !== previousOrganizationOptionValues.length
    ) {
      const sampleEvents = allSites.map(site => site[1]).flat()
      const filteredSitesByCountriesAndOrganizations = sampleEvents.filter(site => {
        const { country_name, tags: organizations } = site
        const countryOptionLabels = countryOptionValues.map(({ label }) => label)
        const organizationOptionLabels = organizationOptionValues.map(({ label }) => label)

        return (
          countryOptionLabels.includes(country_name) ||
          (organizations !== null &&
            organizations
              .map(({ name }) => name)
              .findIndex(item => organizationOptionLabels.includes(item)) !== -1)
        )
      })

      const projectsInFilteredSites = filteredSitesByCountriesAndOrganizations.map(
        ({ project_name }) => project_name,
      )
      const uniqueProjects = [...new Set(projectsInFilteredSites)]
      const updatedProjectOptions = uniqueProjects.length
        ? project_names.map(project_name => {
            return {
              label: project_name,
              group: uniqueProjects.includes(project_name)
                ? 'Projects based on current filters'
                : 'Other projects',
            }
          })
        : project_names.map(project_name => {
            return {
              label: project_name,
              group: '',
            }
          })

      setProjectOptions(updatedProjectOptions)
    }
  }, [
    allSites,
    countryOptionValues,
    organizationOptionValues,
    previousCountryOptionValues,
    previousOrganizationOptionValues,
    project_names,
  ])

  const _updateOrganizationOptions = useEffect(() => {
    if (
      !previousCountryOptionValues ||
      countryOptionValues.length !== previousCountryOptionValues.length ||
      !previousProjectOptionValues ||
      projectOptionValues.length !== previousProjectOptionValues.length
    ) {
      const sampleEvents = allSites.map(site => site[1]).flat()
      const filteredSitesByCountriesAndProjects = sampleEvents.filter(site => {
        const { country_name, project_name } = site
        const countryOptionLabels = countryOptionValues.map(({ label }) => label)
        const projectOptionLabels = projectOptionValues.map(({ label }) => label)

        return (
          countryOptionLabels.includes(country_name) || projectOptionLabels.includes(project_name)
        )
      })

      const organizationsInFilteredSites = filteredSitesByCountriesAndProjects
        .map(({ tags: organizations }) => organizations)
        .flat()
      const organizationNames = organizationsInFilteredSites
        .filter(organization => organization !== null)
        .map(({ name }) => name)
      const uniqueOrganizations = [...new Set(organizationNames)]
      const updatedOrganizationOptions = uniqueOrganizations.length
        ? organization_names.map(organization_name => {
            return {
              label: organization_name,
              group: uniqueOrganizations.includes(organization_name)
                ? 'Organizations based on current filters'
                : 'Other organizations',
            }
          })
        : organization_names.map(organization_name => {
            return {
              label: organization_name,
              group: '',
            }
          })

      setOrganizationOptions(updatedOrganizationOptions)
    }
  }, [
    allSites,
    countryOptionValues,
    projectOptionValues,
    previousCountryOptionValues,
    previousProjectOptionValues,
    organization_names,
  ])

  return (
    <>
      <AutocompleteFilter
        id="country"
        label="Country"
        values={countryOptionValues}
        handleValuesChange={handleCountryOptionValuesChange}
        autocompleteValue={countryOptionValues}
        options={countryOptions}
        addQueryStrings={addQueryStrings}
      />
      <AutocompleteFilter
        id="project"
        label="Project"
        values={projectOptionValues}
        handleValuesChange={handleProjectOptionValuesChange}
        options={projectOptions}
        addQueryStrings={addQueryStrings}
      />
      <AutocompleteFilter
        id="organization"
        label="Organization"
        values={organizationOptionValues}
        handleValuesChange={handleOrganizationOptionValuesChange}
        options={organizationOptions}
        addQueryStrings={addQueryStrings}
      />
    </>
  )
}

CountryProjectOrganizationInputs.propTypes = {
  allSites: sitesPropType.isRequired,
  countryOptionValues: dropdownOptionsPropType.isRequired,
  projectOptionValues: dropdownOptionsPropType.isRequired,
  organizationOptionValues: dropdownOptionsPropType.isRequired,
  handleCountryOptionValuesChange: PropTypes.func.isRequired,
  handleProjectOptionValuesChange: PropTypes.func.isRequired,
  handleOrganizationOptionValuesChange: PropTypes.func.isRequired,
  addQueryStrings: PropTypes.func.isRequired,
  filterChoices: filterChoicesPropType.isRequired,
}

export default CountryProjectOrganizationInputs
