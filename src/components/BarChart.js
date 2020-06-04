import React from 'react';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTooltip } from 'victory';

import PropTypes from 'prop-types';

const calculateYs = content => {
  return content.reduce((total, content) => {
    return total + content.y;
  }, 0);
};

const BarChart = ({ chartContent }) => {
  const nonZeroContent = calculateYs(chartContent);

  if (chartContent)
    return (
      <VictoryChart domainPadding={9}>
        <VictoryAxis
          label="% Hard Coral Cover"
          tickValues={[0.05, 0.25, 0.5, 0.75, 1]}
          tickFormat={['5', '25', '50', '75', '100']}
          style={{
            tickLabels: { fontSize: 10, padding: 5 }
          }}
        />

        <VictoryAxis
          dependentAxis
          label="Number of Sites"
          tickValues={nonZeroContent > 0 ? [] : ['0', '20', '40', '60']}
          style={{
            tickLabels: { fontSize: 10, padding: 5 }
          }}
        />
        <VictoryBar
          data={chartContent}
          barWidth={17}
          style={{ data: { fill: '#1E90FF' } }}
          animate={{
            duration: 1000,
            onLoad: { duration: 500 },
            onEnter: { duration: 400, before: () => ({ y: 0 }) }
          }}
          labelComponent={
            <VictoryTooltip
              cornerRadius={10}
              pointerLength={0}
              flyoutStyle={{
                stroke: 'cadetblue',
                strokeWidth: 2,
                fill: 'skyblue',
                opacity: 0.75
              }}
              style={{
                padding: 8,
                fontSize: 12
              }}
            />
          }
          events={[
            {
              target: 'data',
              eventHandlers: {
                onMouseOver: () => {
                  return [
                    {
                      target: 'data',
                      mutation: () => ({ style: { fill: 'tomato', width: 30 } })
                    },
                    {
                      target: 'labels',
                      mutation: () => ({ active: true })
                    }
                  ];
                },
                onMouseOut: () => {
                  return [
                    {
                      target: 'data',
                      mutation: () => {}
                    },
                    {
                      target: 'labels',
                      mutation: () => ({ active: false })
                    }
                  ];
                }
              }
            }
          ]}
          x="x"
          y="y"
        />
      </VictoryChart>
    );
};

BarChart.propTypes = {
  chartContent: PropTypes.array
};

export default BarChart;
