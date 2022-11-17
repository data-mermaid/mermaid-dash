import { bleachingCategories } from '../constants/transect-protocols';

export default function getChartContent(content, isBleaching) {
  if (isBleaching) {
    return bleachingCategories.map(({ name, type }) => {
      return { x: name, y: content[type] };
    });
  }
  return Object.entries(content).map(([attribute, value]) => {
    return { x: attribute, y: value };
  });
}
