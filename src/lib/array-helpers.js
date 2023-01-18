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
