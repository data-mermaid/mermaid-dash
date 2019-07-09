import React from 'react';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTooltip } from 'victory';

import PropTypes from 'prop-types';

const BarChart = props => (
  <VictoryChart domainPadding={{ x: 10 }} domain={{ x: [0, 100] }}>
    <VictoryAxis
      label="% Hard Coral Cover"
      tickValues={[0, 25, 50, 75, 100]}
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
      alignment="start"
      barWidth={15}
      style={{ data: { fill: '#1E90FF' } }}
      data={props.chartContent}
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
      x="hardCoral"
      y="sites"
    />
  </VictoryChart>
);

BarChart.propTypes = {
  chartContent: PropTypes.array
};

export default BarChart;
