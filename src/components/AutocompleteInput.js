import React from 'react';

import AutocompleteFilter from './AutocompleteFilter';
import sortArray from '../lib/array-helpers';

const AutocompleteInput = ({ filterParams, addQueryStrings, filterChoices }) => {
  const { countries, projects, tags } = filterChoices;
  const country_names = sortArray(countries, 'name');
  const project_names = sortArray(projects, 'name');
  const tag_names = sortArray(tags, 'name');

  return (
    <>
      <AutocompleteFilter
        id="country"
        label="Country"
        options={country_names}
        preFilledValues={filterParams.country}
        addQueryStrings={addQueryStrings}
      />
      <AutocompleteFilter
        id="project"
        label="Project"
        options={project_names}
        preFilledValues={filterParams.project}
        addQueryStrings={addQueryStrings}
      />
      <AutocompleteFilter
        id="organization"
        label="Organization"
        options={tag_names}
        preFilledValues={filterParams.organization}
        addQueryStrings={addQueryStrings}
      />
    </>
  );
};

export default AutocompleteInput;
