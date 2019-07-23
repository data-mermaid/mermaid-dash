import React from 'react';
import { VictoryPie, VictoryLegend } from 'victory';

// import PropTypes from 'prop-types';

const PieChart = ({ chartContent, chartLegend }) => (
  <svg width="100%" height={450}>
    <VictoryLegend
      standalone={false}
      colorScale={[
        '#4B3991',
        '#8B0033',
        '#C8283D',
        '#EE5634',
        '#FB9E4F',
        '#FDDA79',
        '#E0F686',
        '#9ED893',
        '#57B894',
        '#2A74AF'
      ]}
      x={500}
      y={40}
      gutter={20}
      title={chartLegend.title}
      centerTitle
      style={{ border: { stroke: 'black' } }}
      data={chartLegend.data}
    />
    <VictoryPie
      standalone={false}
      innerRadius={100}
      width={500}
      padding={{
        right: 10,
        bottom: 20,
        top: 50
      }}
      labels={() => null}
      colorScale={[
        '#4B3991',
        '#8B0033',
        '#C8283D',
        '#EE5634',
        '#FB9E4F',
        '#FDDA79',
        '#E0F686',
        '#9ED893',
        '#57B894',
        '#2A74AF'
      ]}
      data={chartContent}
      events={[
        {
          target: 'data',
          eventHandlers: {
            onMouseOver: () => {
              return [
                {
                  target: 'data',
                  mutation: () => ({ style: { fill: 'black', opacity: 0.5, cursor: 'pointer' } })
                },
                {
                  target: 'labels',
                  mutation: props => {
                    // console.log(props);
                    const labelCLicked = props.datum.x + '\n' + props.datum.y;
                    return { active: true, text: labelCLicked };
                  }
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
    />
  </svg>
);

export default PieChart;
