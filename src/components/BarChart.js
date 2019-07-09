import React from 'react';
import { VictoryBar, VictoryChart, VictoryAxis } from 'victory';

import PropTypes from 'prop-types';

const BarChart = props => (
  <VictoryChart domainPadding={{ x: 10, y: 40 }}>
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
      events={[
        {
          target: 'data',
          eventHandlers: {
            onClick: () => {
              return [
                {
                  target: 'data',
                  mutation: props => {
                    return props.text === 'clicked' ? null : { text: 'clicked' };
                  }
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

export default BarChart;
