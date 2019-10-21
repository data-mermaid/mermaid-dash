import React from 'react';
import { VictoryPie, VictoryLegend, VictoryTooltip } from 'victory';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { privateColorScale, attributeColors } from '../constants/attribute-colors';

const ChartWrapper = styled('div')`
  width: 100%;
  padding-top: 20px;
  display: flex;
  flex-direction: ${props => (props.mediaMin600_Max960 || !props.mediaMax1280 ? 'row' : 'column')};
  filter: ${props => props.policy && 'blur(0.8rem)'};
`;

const PieChart = ({ protocolName, chartContent, setToPrivate, privateLabel }) => {
  const mediaMin600 = useMediaQuery('(min-width:600px)');
  const mediaMax960 = useMediaQuery('(max-width:960px');
  const mediaMin960 = useMediaQuery('(min-width:960px)');
  const mediaMin1281 = useMediaQuery('(min-width:1281px)');
  const mediaMax1280 = useMediaQuery('(max-width:1280px)');
  const mediaMin600_Max960 = mediaMax960 && mediaMin600;

  const benthicAttributeCollection = chartContent.map(({ x }) => x);
  const filteredAttributeCollection = attributeColors.filter(({ name }) =>
    benthicAttributeCollection.includes(name)
  );

  const benthicsColorScale = filteredAttributeCollection.map(({ color }) => color);
  const contentData = filteredAttributeCollection.map(({ name }) => {
    const foundAttribute = chartContent.find(({ x }) => x === name);
    return { x: name, y: foundAttribute.y };
  });

  //only show legend item with value greater than 0%
  const legendData = contentData
    .filter(({ y }) => y > 0)
    .map(({ x }) => ({ name: x, symbol: { type: 'square' } }));

  return (
    <ChartWrapper
      mediaMax1280={mediaMax1280}
      mediaMin600_Max960={mediaMin600_Max960}
      policy={setToPrivate}
    >
      <VictoryPie
        innerRadius={mediaMax1280 ? 90 : 110}
        height={mediaMax1280 ? 300 : 400}
        width={mediaMax1280 ? 400 : 450}
        padding={mediaMax1280 ? 30 : 50}
        labels={val => {
          return val.x + '\n' + val.y.toFixed(1) + '%';
        }}
        labelComponent={
          <VictoryTooltip
            x={mediaMax1280 ? 200 : 220}
            y={mediaMax1280 ? 190 : 230}
            orientation="top"
            pointerLength={0}
            flyoutStyle={{
              stroke: 'transparent',
              fill: 'transparent'
            }}
          />
        }
        colorScale={setToPrivate ? privateColorScale : benthicsColorScale}
        data={setToPrivate ? chartContent : contentData}
        events={[
          {
            target: 'data',
            eventHandlers: {
              onMouseOver: () => {
                return [
                  {
                    target: 'data',
                    mutation: () => ({
                      style: {
                        fill: 'smoke',
                        opacity: 0.3,
                        transition: '0.25s ease-in-out'
                      }
                    })
                  },
                  {
                    target: 'labels',
                    mutation: () => ({ active: true, fontSize: 20 })
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
      <VictoryLegend
        colorScale={setToPrivate ? privateColorScale : benthicsColorScale}
        orientation="horizontal"
        height={mediaMin1281 ? 500 : mediaMin600_Max960 ? 310 : 140}
        itemsPerRow={
          mediaMin1281 || mediaMin600_Max960 || legendData.length <= 4 ? 1 : mediaMin960 ? 3 : 2
        }
        style={{
          labels: {
            fontSize: mediaMin1281 ? 20 : mediaMin600_Max960 ? 13 : 11,
            fontFamily: 'Arial'
          }
        }}
        data={legendData}
      />
    </ChartWrapper>
  );
};

PieChart.propTypes = {
  protocolName: PropTypes.string,
  chartContent: PropTypes.array,
  setToPrivate: PropTypes.bool,
  privateLabel: PropTypes.string
};

export default PieChart;
