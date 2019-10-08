import React from 'react';

import Box from '@material-ui/core/Box';

import BarChart from './BarChart';
import PieChart from './PieChart';

const CardChartContent = ({
  chartType,
  pieChartContent,
  pieChartLegend,
  setToPrivate,
  privateLabel,
  histogramContent
}) => {
  const chart =
    chartType === 'histogramChart' ? (
      <BarChart chartContent={histogramContent} />
    ) : (
      <PieChart
        chartContent={pieChartContent}
        chartLegend={pieChartLegend}
        setToPrivate={setToPrivate}
        privateLabel={privateLabel}
      />
    );

  return <Box>{chart}</Box>;
};

export default CardChartContent;
