import { bleachingCategories } from '../constants/sample-unit-information'

export default function getChartContent(content, isBleaching) {
  if (isBleaching) {
    return bleachingCategories.reduce((accumulator, category) => {
      const { type, name } = category

      if (content[type]) {
        accumulator.push({ x: name, y: content[type] })
      }

      return accumulator
    }, [])
  }

  return Object.entries(content).map(([attribute, value]) => {
    return { x: attribute, y: value }
  })
}
