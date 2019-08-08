import React from 'react';

import Box from '@material-ui/core/Box';

import BarChart from './BarChart';
import PieChart from './PieChart';

const Chart = ({ chartType, chartContent, chartLegend, chartPolicy }) => {
  const chart =
    chartType === 'barChart' ? (
      <BarChart chartContent={chartContent} />
    ) : (
      <PieChart chartContent={chartContent} chartLegend={chartLegend} chartPolicy={chartPolicy} />
    );

  return <Box m={1}>{chart}</Box>;
};

export default Chart;
