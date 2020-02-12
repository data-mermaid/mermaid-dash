import React from 'react';

import AutocompleteFilter from './AutocompleteFilter';

const AutocompleteInput = ({ filterParams, addQueryStrings, filterChoices }) => {
  const country_names = filterChoices.countries.map(country => country.name);
  const project_names = filterChoices.projects.map(project => project.name);
  const tag_names = filterChoices.tags.map(tag => tag.name);

  const convertToName = (ids, filtered_options) => {
    const result = filtered_options.reduce((newArr, obj) => {
      if (ids.includes(obj.id)) {
        newArr.push(obj.name);
      }
      return newArr;
    }, []);
    return result;
  };

  return (
    <>
      <AutocompleteFilter
        id="country_name"
        label="Country"
        options={country_names}
        preFilledValues={filterParams.country_name}
        addQueryStrings={addQueryStrings}
      />
      <AutocompleteFilter
        id="project_id"
        label="Project"
        options={project_names}
        preFilledValues={convertToName(filterParams.project_id, filterChoices.projects)}
        addQueryStrings={addQueryStrings}
      />
      <AutocompleteFilter
        id="tag_id"
        label="Organization"
        options={tag_names}
        preFilledValues={convertToName(filterParams.tag_id, filterChoices.tags)}
        addQueryStrings={addQueryStrings}
      />
    </>
  );
};

export default AutocompleteInput;
