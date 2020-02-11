import React from 'react';

import AutocompleteFilter from './AutocompleteFilter';

const AutocompleteInput = ({ filterParams, addQueryStrings, filterChoices }) => {
  const country_names = filterChoices.countries.map(country => country.name);
  const project_names = filterChoices.projects.map(project => project.name);

  const convertToName = id => {
    const result = filterChoices.projects.reduce((newArr, obj) => {
      if (id.includes(obj.id)) {
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
        preFilledValues={convertToName(filterParams.project_id)}
        addQueryStrings={addQueryStrings}
      />
    </>
  );
};

export default AutocompleteInput;
