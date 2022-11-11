export const protocolsArray = [
  {
    name: 'benthiclit',
    title: 'Benthic % Cover (LIT)',
    property: 'percent_cover_by_benthic_category_avg',
    type: 'pieChart'
  },
  {
    name: 'benthicpit',
    title: 'Benthic % Cover (PIT)',
    property: 'percent_cover_by_benthic_category_avg',
    type: 'pieChart'
  },
  {
    name: 'beltfish',
    title: 'Fish Belt',
    property: 'biomass_kgha_by_trophic_group_avg',
    type: 'pieChart'
  },
  {
    name: 'bleachingqc',
    title: 'Bleaching',
    property: 'quadrat_benthic_percent',
    type: 'pieChart'
  }
];

export const bleachingCategories = [
  { type: 'percent_hard_avg_avg', name: 'Hard coral' },
  { type: 'percent_soft_avg_avg', name: 'Soft coral' },
  { type: 'percent_algae_avg_avg', name: 'Macroalgae' }
];

export const protocolTitles = {
  beltfish: 'Fish Belt',
  benthiclit: 'Benthic LIT',
  benthicpit: 'Benthic PIT',
  habitatcomplexity: 'Habitat Complexity',
  quadrat_benthic_percent: 'Bleaching'
};
