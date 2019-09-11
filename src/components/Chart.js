import React from 'react';

import Box from '@material-ui/core/Box';

import BarChart from './BarChart';
import PieChart from './PieChart';

const Chart = ({
  chartType,
  chartContent,
  chartLegend,
  privatePolicy,
  privateLabel,
  histogram
}) => {
  const chart =
    chartType === 'barChart' ? (
      <BarChart chartContent={histogram} />
    ) : (
      <PieChart
        chartContent={chartContent}
        chartLegend={chartLegend}
        privatePolicy={privatePolicy}
        privateLabel={privateLabel}
      />
    );

  return <Box m={1}>{chart}</Box>;
};

export default Chart;
