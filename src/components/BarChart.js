import React from 'react';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTooltip } from 'victory';

import PropTypes from 'prop-types';

const BarChart = ({ chartContent }) => (
  <VictoryChart domainPadding={9}>
    <VictoryAxis
      label="% Hard Coral Cover"
      tickValues={[1, 5, 10, 15, 20]}
      tickFormat={['0', '25', '50', '75', '100']}
      style={{
        tickLabels: { fontSize: 10, padding: 5 }
      }}
    />
    <VictoryAxis
      dependentAxis
      label="Number of Sites"
      tickFormat={x => `${x}`}
      style={{
        tickLabels: { fontSize: 10, padding: 5 }
      }}
    />
    <VictoryBar
      data={chartContent}
      barWidth={17}
      style={{ data: { fill: '#1E90FF' } }}
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
      x="hardCorals"
      y="sites"
    />
  </VictoryChart>
);

BarChart.propTypes = {
  chartContent: PropTypes.array
};

export default BarChart;
