export default function sortArray(choices, key, isAsc = true) {
  const sorted = choices
    .map(choice => choice[key])
    .sort((a, b) => {
      return a.toString().localeCompare(b, 'en', {
        numeric: true,
        caseFirst: 'upper'
      });
    });

  if (!isAsc) {
    return sorted.reverse();
  }

  return sorted;
}
