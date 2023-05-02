import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'

import AutocompleteFilter from './AutocompleteFilter'
import { sortArray } from '../lib/array-helpers'
import { filterChoicesPropType, filterParamsPropType } from '../lib/mermaidDataPropTypes'

const AutocompleteInput = ({ filterParams, addQueryStrings, filterChoices }) => {
  const { countries, projects, tags } = filterChoices
  const country_names = sortArray(countries, 'name')
  const project_names = sortArray(projects, 'name')
  const tag_names = sortArray(tags, 'name')

  const [countryValue, setCountryValue] = useState([])
  const [projectValue, setProjectValue] = useState(filterParams.project)
  const [organizationValue, setOrganizationValue] = useState(filterParams.organization)

  const _initialFetch = useEffect(() => {
    const initialCountryVal = filterParams.country.map(countryParam => ({
      label: countryParam,
      isMatch: false,
    }))
    setCountryValue(initialCountryVal)
  }, [filterParams])
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
        options={country_names}
        addQueryStrings={addQueryStrings}
      />
      {/* <AutocompleteFilter
        id="project"
        label="Project"
        testValue={projectValue}
        handleValueChange={handleProjectValueChange}
        options={project_names}
        addQueryStrings={addQueryStrings}
      />
      <AutocompleteFilter
        id="organization"
        label="Organization"
        testValue={organizationValue}
        handleValueChange={handleOrganizationValueChange}
        options={tag_names}
        addQueryStrings={addQueryStrings}
      /> */}
    </>
  )
}

AutocompleteInput.propTypes = {
  filterParams: filterParamsPropType.isRequired,
  addQueryStrings: PropTypes.func.isRequired,
  filterChoices: filterChoicesPropType.isRequired,
}

export default AutocompleteInput
