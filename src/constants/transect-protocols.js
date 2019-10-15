export const protocolsArray = [
  {
    name: 'benthiclit',
    title: 'Benthic % Cover (LIT)',
    property: 'coral_cover',
    type: 'pieChart'
  },
  {
    name: 'benthicpit',
    title: 'Benthic % Cover (PIT)',
    property: 'coral_cover',
    type: 'pieChart'
  },
  {
    name: 'beltfish',
    title: 'Fish Belt',
    property: 'biomass_kgha_tg',
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
  { type: 'avg_percent_hard', name: 'Hard coral' },
  { type: 'avg_percent_soft', name: 'Soft coral' },
  { type: 'avg_percent_algae', name: 'Macroalgae' }
];
