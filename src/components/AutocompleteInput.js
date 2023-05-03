import PropTypes from 'prop-types'
import React, { useState, useEffect, useMemo } from 'react'

import AutocompleteFilter from './AutocompleteFilter'
import { sortArray } from '../lib/array-helpers'
import {
  filterChoicesPropType,
  filterParamsPropType,
  sitesPropType,
} from '../lib/mermaidDataPropTypes'
import usePrevious from '../lib/usePrevious'

const AutocompleteInput = ({ filterParams, addQueryStrings, filterChoices, sites }) => {
  const allSites = sites.map(site => site[1]).flat()

  const { countries, projects, tags } = filterChoices
  const country_names = sortArray(countries, 'name')
  const project_names = sortArray(projects, 'name')
  const tag_names = sortArray(tags, 'name')

  const [countryValue, setCountryValue] = useState([])
  const previousCountryValue = usePrevious(countryValue)
  const [projectValue, setProjectValue] = useState([])
  const previousProjectValue = usePrevious(projectValue)
  const [organizationValue, setOrganizationValue] = useState([])
  const previousOrganizationValue = usePrevious(organizationValue)

  const [countryOptions, setCountryOptions] = useState([])
  const [projectOptions, setProjectOptions] = useState([])
  const [organizationOptions, setOrganizationOptions] = useState([])

  const _updateOptionVal = useMemo(() => {
    if (filterParams.country) {
      const initialCountryVal = filterParams.country.map(countryParam => ({
        label: countryParam,
        isMatch: '',
      }))

      setCountryValue(initialCountryVal)
    }

    if (filterParams.project) {
      const initialProjectVal = filterParams.project.map(projectItem => ({
        label: projectItem,
        isMatch: '',
      }))

      setProjectValue(initialProjectVal)
    }

    if (filterParams.organization) {
      const initialOrganizationVal = filterParams.organization.map(organizationItem => ({
        label: organizationItem,
        isMatch: '',
      }))

      setOrganizationValue(initialOrganizationVal)
    }
  }, [filterParams])

  const _updateCountryOptions = useEffect(() => {
    if (
      !previousProjectValue ||
      projectValue.length !== previousProjectValue.length ||
      !previousOrganizationValue ||
      organizationValue.length !== previousOrganizationValue.length
    ) {
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
    allSites,
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
  }, [previousCountryValue, countryValue, project_names])

  const _updateOrganizationOptions = useEffect(() => {
    if (
      !previousCountryValue ||
      countryValue.length !== previousCountryValue.length ||
      !previousProjectValue ||
      projectValue.length !== previousProjectValue.length
    ) {
      const filterSitesByCountry = allSites.filter(aSites => {
        const countryValueLabels = countryValue.map(({ label }) => label)
        const projectValueLabels = projectValue.map(({ label }) => label)

        return (
          countryValueLabels.includes(aSites.country_name) ||
          projectValueLabels.includes(aSites.project_name)
        )
      })
      const tagNameSites = filterSitesByCountry.map(({ tags }) => tags).flat()
      const tagNamesOnly = tagNameSites.filter(tags => tags !== null).map(({ name }) => name)
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
  }, [previousCountryValue, countryValue, project_names])

  const handleCountryValueChange = val => setCountryValue(val)
  const handleProjectValueChange = val => setProjectValue(val)
  const handleOrganizationValueChange = val => setOrganizationValue(val)

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
  filterParams: filterParamsPropType.isRequired,
  addQueryStrings: PropTypes.func.isRequired,
  filterChoices: filterChoicesPropType.isRequired,
  sites: sitesPropType.isRequired,
}

export default AutocompleteInput
