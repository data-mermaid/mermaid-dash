import React from 'react';

import AutocompleteFilter from './AutocompleteFilter';
import byCaseSensitive from '../lib/case-sensitive-sort-fix';

const AutocompleteInput = ({ filterParams, addQueryStrings, filterChoices }) => {
  const country_names = filterChoices.countries.map(country => country.name).sort(byCaseSensitive);
  const project_names = filterChoices.projects.map(project => project.name).sort(byCaseSensitive);
  const tag_names = filterChoices.tags.map(tag => tag.name).sort(byCaseSensitive);

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
