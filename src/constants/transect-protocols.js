export const bleachingCategories = [
  { type: 'percent_hard_avg_avg', name: 'Hard coral' },
  { type: 'percent_soft_avg_avg', name: 'Soft coral' },
  { type: 'percent_algae_avg_avg', name: 'Macroalgae' },
]

export const chartContentProperties = {
  benthiclit: 'percent_cover_by_benthic_category_avg',
  benthicpit: 'percent_cover_by_benthic_category_avg',
  benthicpqt: 'percent_cover_by_benthic_category_avg',
  beltfish: 'biomass_kgha_by_trophic_group_avg',
  quadrat_benthic_percent: 'quadrat_benthic_percent',
}

export const chartTitles = {
  benthiclit: 'Benthic % Cover (LIT)',
  benthicpit: 'Benthic % Cover (PIT)',
  benthicpqt: 'Benthic % Cover (Photo Quadrat)',
  beltfish: 'Fish Belt',
  quadrat_benthic_percent: 'Bleaching',
}
export const protocolMethods = {
  beltfish: 'Fish Belt',
  benthiclit: 'Benthic LIT',
  benthicpit: 'Benthic PIT',
  benthicpqt: 'Benthic Photo Quadrat',
  habitatcomplexity: 'Habitat Complexity',
  quadrat_benthic_percent: 'Bleaching',
}

export const pluralizedProtocols = {
  beltfish: 'beltfishes',
  benthiclit: 'benthiclits',
  benthicpit: 'benthicpits',
  benthicpqt: 'benthicpqts',
  habitatcomplexity: 'habitatcomplexities',
  quadrat_benthic_percent: 'bleachingqcs',
}
