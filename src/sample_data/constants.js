const Constants = {
  summary: {
    title: 'Summary Statistics',
    header: 'Data is more powerful when shared',
    body:
      'Mermaid believes in coral reef conservation through collaboration. We use cutting edge technology to visualize, analyse and share data about coral reefs in near real time, and for free.',
    type: 'text'
  },
  histogram: {
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
    type: 'histogramChart'
  },
  pieChartDefault: {
    body: [
      { x: 'Herbivore-detritivore', y: 77.9 },
      { x: 'Herbivore-macroalgae', y: 24.1 },
      { x: 'Invertivore-mobile', y: 193.0 },
      { x: 'Invertivore-sessile', y: 34.6 },
      { x: 'Omnivore', y: 74.5 },
      { x: 'Piscivore', y: 177.4 }
    ],
    legendTitle: 'Private group',
    legend: [
      { name: 'Herbivore-detritivore' },
      { name: 'Herbivore-macroalgae' },
      { name: 'Invertivore-mobile' },
      { name: 'Invertivore-sessile' },
      { name: 'Omnivore' },
      { name: 'Piscivore' }
    ]
  }
};

export default Constants;
