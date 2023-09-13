export const FISHBELT_SAMPLE_UNIT = 'beltfish'
export const BENTHIC_PIT_SAMPLE_UNIT = 'benthicpit'
export const BENTHIC_LIT_SAMPLE_UNIT = 'benthiclit'
export const BENTHIC_PHOTO_QUADRAT_SAMPLE_UNIT = 'benthicpqt'
export const HABITAT_COMPLEXITY_SAMPLE_UNIT = 'habitatcomplexity'
export const BLEACHING_SAMPLE_UNIT = 'bleachingqc'
export const BLEACHING_PROPERTY_QUADRAT_BENTHIC_PERCENT = 'quadrat_benthic_percent'
export const BLEACHING_PROPERTY_COLONIES_BLEACHED = 'colonies_bleached'

export const bleachingCategories = [
  { type: 'percent_hard_avg_avg', name: 'Hard coral' },
  { type: 'percent_soft_avg_avg', name: 'Soft coral' },
  { type: 'percent_algae_avg_avg', name: 'Macroalgae' },
]

export const chartContentProperties = {
  [BENTHIC_LIT_SAMPLE_UNIT]: 'percent_cover_by_benthic_category_avg',
  [BENTHIC_PIT_SAMPLE_UNIT]: 'percent_cover_by_benthic_category_avg',
  [BENTHIC_PHOTO_QUADRAT_SAMPLE_UNIT]: 'percent_cover_by_benthic_category_avg',
  [FISHBELT_SAMPLE_UNIT]: 'biomass_kgha_by_trophic_group_avg',
  [BLEACHING_PROPERTY_QUADRAT_BENTHIC_PERCENT]: 'quadrat_benthic_percent',
}

export const chartTitles = {
  [BENTHIC_LIT_SAMPLE_UNIT]: 'Benthic % Cover (LIT)',
  [BENTHIC_PIT_SAMPLE_UNIT]: 'Benthic % Cover (PIT)',
  [BENTHIC_PHOTO_QUADRAT_SAMPLE_UNIT]: 'Benthic % Cover (Photo Quadrat)',
  [FISHBELT_SAMPLE_UNIT]: 'Fish Belt',
  [BLEACHING_PROPERTY_QUADRAT_BENTHIC_PERCENT]: 'Bleaching',
}

export const protocolTitles = {
  [FISHBELT_SAMPLE_UNIT]: 'Fish Belt',
  [BENTHIC_LIT_SAMPLE_UNIT]: 'Benthic LIT',
  [BENTHIC_PIT_SAMPLE_UNIT]: 'Benthic PIT',
  [BENTHIC_PHOTO_QUADRAT_SAMPLE_UNIT]: 'Benthic Photo Quadrat',
  [HABITAT_COMPLEXITY_SAMPLE_UNIT]: 'Habitat Complexity',
  [BLEACHING_PROPERTY_QUADRAT_BENTHIC_PERCENT]: 'Bleaching',
}

export const pluralizedSampleUnits = {
  [FISHBELT_SAMPLE_UNIT]: 'beltfishes',
  [BENTHIC_LIT_SAMPLE_UNIT]: 'benthiclits',
  [BENTHIC_PIT_SAMPLE_UNIT]: 'benthicpits',
  [BENTHIC_PHOTO_QUADRAT_SAMPLE_UNIT]: 'benthicpqts',
  [HABITAT_COMPLEXITY_SAMPLE_UNIT]: 'habitatcomplexities',
  [BLEACHING_PROPERTY_QUADRAT_BENTHIC_PERCENT]: 'bleachingqcs',
}
