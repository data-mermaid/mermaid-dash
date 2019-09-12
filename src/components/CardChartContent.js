import React from 'react';

import Box from '@material-ui/core/Box';

import BarChart from './BarChart';
import PieChart from './PieChart';

const CardChartContent = ({
  chartType,
  pieChartContent,
  pieChartLegend,
  privatePolicy,
  privateLabel,
  histogram
}) => {
  const chart =
    chartType === 'histogramChart' ? (
      <BarChart chartContent={histogram} />
    ) : (
      <PieChart
        chartContent={pieChartContent}
        chartLegend={pieChartLegend}
        privatePolicy={privatePolicy}
        privateLabel={privateLabel}
      />
    );

  return <Box m={1}>{chart}</Box>;
};

export default CardChartContent;
