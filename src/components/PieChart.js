import React, { useState } from 'react';
import { VictoryPie, VictoryLegend } from 'victory';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { privateColorScale, attributeColors } from '../constants/attribute-colors';

const LabelContainer = styled('div')`
  position: relative;
  top: ${props => (props.mediaMin600_Max960 ? '165px' : props.mediaMax1280 ? '210px' : '165px')};
  left: ${props => (props.mediaMin600_Max960 ? '105px' : props.mediaMax1280 ? '160px' : '80px')};
  width: 140px;
  height: 50px;
`;
const PrivateLabelContainer = styled('div')`
  position: relative;
  top: ${props => (props.mediaMax1280 ? '210px' : '165px')};
  left: ${props => (props.mediaMax1280 ? '90px' : '150px')};
  width: 60%;
  z-index: 1;
`;

const Label = styled('div')`
  opacity: ${props => (props.content ? 1 : 0)};
  transition: opacity 0.5s ease-in-out;
  text-align: center;
  font-size: 13px;
  &::before {
    content: '${props => props.content}';
  }
`;
const PrivateLabel = styled('div')`
  text-align: center;
  font-size: 22px;
  &::before {
    content: '${props => props.content}';
  }
`;

const ChartWrapper = styled('div')`
  width: 100%;
  /* height: ${props => (props.mediaMax1280 ? '450px' : '100%')}; */
  height: 100%;
  display: flex;
  flex-direction: ${props => (props.mediaMin600_Max960 || !props.mediaMax1280 ? 'row' : 'column')};
  filter: ${props => props.policy && 'blur(0.8rem)'};
`;

const PieChart = ({ protocolName, chartContent, setToPrivate, privateLabel }) => {
  const [centerLabel, setCenterLabel] = useState({ number: null, label: null, category: null });
  const mediaMin600 = useMediaQuery('(min-width:600px)');
  const mediaMax960 = useMediaQuery('(max-width:960px');
  const mediaMin960 = useMediaQuery('(min-width:960px)');
  const mediaMin1281 = useMediaQuery('(min-width:1281px)');
  const mediaMax1280 = useMediaQuery('(max-width:1280px)');
  const mediaMin600_Max960 = mediaMax960 && mediaMin600;
  console.log('inBetweenMedia ', mediaMin600_Max960);

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

  const labelControl = (
    <LabelContainer
      mediaMin600_Max960={mediaMin600_Max960}
      mediaMax960={mediaMax960}
      mediaMax1280={mediaMax1280}
    >
      <Label content={centerLabel.label} />
      {centerLabel.category !== 'beltfish' ? (
        <Label content={centerLabel.number && `${centerLabel.number.toFixed(1)}%`} />
      ) : (
        <Label content={centerLabel.number && `${centerLabel.number.toFixed(1)}kg/ha`} />
      )}
    </LabelContainer>
  );

  const privateLabelControl = setToPrivate && (
    <PrivateLabelContainer mediaMax1280={mediaMax1280}>
      <PrivateLabel content={privateLabel} />
    </PrivateLabelContainer>
  );

  return (
    <div>
      {setToPrivate ? privateLabelControl : labelControl}
      <ChartWrapper
        mediaMax1280={mediaMax1280}
        mediaMin600_Max960={mediaMin600_Max960}
        policy={setToPrivate}
      >
        <VictoryPie
          innerRadius={90}
          height={mediaMax1280 ? 300 : 360}
          width={mediaMax1280 ? 400 : 400}
          padding={mediaMax1280 ? 30 : 60}
          labels={() => null}
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
                      mutation: data => {
                        const {
                          datum: { x: label, y: number }
                        } = data;
                        setCenterLabel({
                          category: protocolName,
                          number,
                          label
                        });
                      }
                    },
                    {
                      target: 'data',
                      mutation: () => ({
                        style: {
                          fill: 'smoke',
                          opacity: 0.6,
                          transition: '0.25s ease-in-out'
                        }
                      })
                    }
                  ];
                },
                onMouseOut: () => {
                  return [
                    {
                      target: 'data',
                      mutation: () => {
                        setCenterLabel({
                          category: null,
                          number: null,
                          label: null
                        });
                      }
                    },
                    {
                      target: 'data',
                      mutation: () => {}
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
    </div>
  );
};

PieChart.propTypes = {
  protocolName: PropTypes.string,
  chartContent: PropTypes.array,
  setToPrivate: PropTypes.bool,
  privateLabel: PropTypes.string
};

export default PieChart;
