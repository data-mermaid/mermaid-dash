import React from 'react';

import Box from '@material-ui/core/Box';
import PropTypes from 'prop-types';

import BarChart from './BarChart';
import PieChart from './PieChart';

const CardChartContent = ({
  chartType,
  pieChartContent,
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
        setToPrivate={setToPrivate}
        privateLabel={privateLabel}
      />
    );

  return <Box>{chart}</Box>;
};

CardChartContent.propTypes = {
  chartType: PropTypes.string,
  pieChartContent: PropTypes.object,
  setToPrivate: PropTypes.bool,
  privateLabel: PropTypes.string,
  histogramContent: PropTypes.array
};

export default CardChartContent;
