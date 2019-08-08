const Samples = {
  summary: {
    title: 'Summary Statistics',
    header: 'Data is more powerful when shared',
    body:
      'Mermaid believes in coral reef conservation through collaboration. We use cutting edge technology to visualize, analyse and share data about coral reefs in near real time, and for free.',
    type: 'text'
  },
  barChartData: {
    title: 'Live Coral Cover',
    body: [
      { hardCorals: 1, sites: 50, label: 50 },
      { hardCorals: 2, sites: 80, label: 80 },
      { hardCorals: 3, sites: 84, label: 84 },
      { hardCorals: 4, sites: 73, label: 73 },
      { hardCorals: 5, sites: 75, label: 75 },
      { hardCorals: 6, sites: 60, label: 60 },
      { hardCorals: 7, sites: 70, label: 70 },
      { hardCorals: 8, sites: 30, label: 30 },
      { hardCorals: 9, sites: 20, label: 20 },
      { hardCorals: 10, sites: 50, label: 50 },
      { hardCorals: 11, sites: 42, label: 42 },
      { hardCorals: 12, sites: 36, label: 36 },
      { hardCorals: 13, sites: 34, label: 34 },
      { hardCorals: 14, sites: 41, label: 41 },
      { hardCorals: 15, sites: 31, label: 31 },
      { hardCorals: 16, sites: 28, label: 28 },
      { hardCorals: 17, sites: 25, label: 25 },
      { hardCorals: 18, sites: 20, label: 20 },
      { hardCorals: 19, sites: 20, label: 20 },
      { hardCorals: 20, sites: 5, label: 5 }
    ],
    legend: {},
    type: 'barChart'
  },
  benthicPieChartData: {
    title: 'Benthic Condition, % Cover',
    body: [
      { x: 'Bare substrate', y: 15 },
      { x: 'Crustose coralline algae', y: 21 },
      { x: 'Cyanobacteria', y: 14 },
      { x: 'Hard coral', y: 10 },
      { x: 'Macroalgae', y: 5 },
      { x: 'Other invertebrates', y: 9 },
      { x: 'Rubble', y: 6 },
      { x: 'Sand', y: 3 },
      { x: 'Soft coral', y: 4 },
      { x: 'Turf algae', y: 3 }
    ],
    dataPolicy: {
      name: 'Public Summary',
      privateLabel:
        'This data is unavailable because Benthic: PIT, LIT and Habitat Complexity are set to Private for this project.'
    },
    sampleUnits: 21,
    hardCoralCovers: 6.8,
    legend: {
      title: 'Benthic category',
      data: [
        { name: 'Bare substrate' },
        { name: 'Crustose coralline algae' },
        { name: 'Cyanobacteria' },
        { name: 'Hard coral' },
        { name: 'Macroalgae' },
        { name: 'Other invertebrates' },
        { name: 'Rubble' },
        { name: 'Sand' },
        { name: 'Soft coral' },
        { name: 'Turf algae' }
      ]
    },
    type: 'pieChart'
  },
  fishBeltPieChartData: {
    title: 'Fish Belt',
    body: [
      { x: 'Herbivore-detritivore', y: 6 },
      { x: 'Herbivore-macroalgae', y: 8 },
      { x: 'Invertivore-mobile', y: 12 },
      { x: 'Invertivore-sessile', y: 10 },
      { x: 'Omnivore', y: 20 },
      { x: 'Piscivore', y: 14 },
      { x: 'Planktivore', y: 30 }
    ],
    dataPolicy: {
      name: 'Private',
      privateLabel:
        'This data is unavailable because Fish Belt Sample Units are set to Private for this project.'
    },
    sampleUnits: 10,
    reefFishBiomass: 688.5,
    legend: {
      title: 'Tropic group',
      data: [
        { name: 'Herbivore-detritivore' },
        { name: 'Herbivore-macroalgae' },
        { name: 'Invertivore-mobile' },
        { name: 'Invertivore-sessile' },
        { name: 'Omnivore' },
        { name: 'Piscivore' },
        { name: 'Planktivore' }
      ]
    },
    type: 'pieChart'
  }
};

export default Samples;
