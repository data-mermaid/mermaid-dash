export const sortArray = (choices, key, isAsc = true) => {
  const sorted = choices
    .map(choice => choice[key])
    .sort((a, b) => {
      return a.toString().localeCompare(b, 'en', {
        numeric: true,
        caseFirst: 'upper',
      })
    })

  if (!isAsc) {
    return sorted.reverse()
  }

  return sorted
}

export const convertQueryParamsToIds = (queryNames, filteredOptions) => {
  return [...queryNames]
    .map(name => {
      return filteredOptions.find(item => item.name === name)?.id
    })
    .join(',')
}

export const getChoices = (tableName, choices) => {
  return choices.find(choice => tableName === choice.name).data || []
}

export const getSitesGroupBySampleEvents = sampleEvents => {
  const sortedSampleEvents = sampleEvents.sort((a, b) => (a.sample_date > b.sample_date ? 1 : -1))

  const siteGroups = sortedSampleEvents.reduce((acc, sample) => {
    acc[sample.site_id] = acc[sample.site_id] || []
    acc[sample.site_id].push(sample)

    return acc
  }, {})

  return Object.entries(siteGroups)
}
