import React from 'react'

import Box from '@material-ui/core/Box'
import PropTypes from 'prop-types'

import BarChart from './BarChart'
import PieChart from './PieChart'
import { histogramContentPropType, pieChartContentPropType } from '../lib/mermaidDataPropTypes'

const CardChartContent = ({
  chartType,
  sampleUnit,
  pieChartContent,
  isPrivatePolicy,
  title,
  histogramContent,
}) => {
  const chart =
    chartType === 'histogramChart' ? (
      <BarChart chartContent={histogramContent} />
    ) : (
      <PieChart
        sampleUnit={sampleUnit}
        chartContent={pieChartContent}
        isPrivatePolicy={isPrivatePolicy}
        title={title}
      />
    )

  return <Box>{chart}</Box>
}

CardChartContent.propTypes = {
  chartType: PropTypes.string.isRequired,
  sampleUnit: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  isPrivatePolicy: PropTypes.bool.isRequired,
  pieChartContent: pieChartContentPropType,
  histogramContent: histogramContentPropType,
}

CardChartContent.defaultProps = {
  pieChartContent: [],
  histogramContent: [],
}

export default CardChartContent
