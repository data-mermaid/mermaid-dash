import React, { useState } from 'react';
import { VictoryPie, VictoryLegend } from 'victory';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { privateColorScale, attributeColors } from '../constants/attribute-colors';

const LabelContainer = styled('div')`
  position: relative;
  top: ${props => (props.smScreen ? '165px' : props.mdScreen ? '210px' : '165px')};
  left: ${props => (props.smScreen ? '105px' : props.mdScreen ? '160px' : '80px')};
  width: 140px;
  height: 50px;
`;
const PrivateLabelContainer = styled('div')`
  position: relative;
  top: ${props => (props.mdScreen ? '210px' : '165px')};
  left: ${props => (props.mdScreen ? '90px' : '150px')};
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
  height: ${props => (props.mdScreen ? '450px' : '100%')};
  display: flex;
  flex-direction: ${props => (props.mdScreen ? 'column' : 'row')};
  filter: ${props => props.policy && 'blur(0.8rem)'};
`;

const PieChart = ({ protocolName, chartContent, setToPrivate, privateLabel }) => {
  const [centerLabel, setCenterLabel] = useState({ number: null, label: null, category: null });
  const mediaMax960 = useMediaQuery('(max-width:960px');
  const mediaMin960 = useMediaQuery('(min-width:960px)');
  const mediaMin1281 = useMediaQuery('(min-width:1281px)');
  const mediaMax1280 = useMediaQuery('(max-width:1280px)');

  const benthicAttributeCollection = chartContent.map(({ x }) => x);
  const filteredAttributeCollection = attributeColors.filter(({ name }) =>
    benthicAttributeCollection.includes(name)
  );

  const legendData = filteredAttributeCollection.map(({ name }) => ({
    name,
    symbol: { type: 'square' }
  }));
  const benthicsColorScale = filteredAttributeCollection.map(({ color }) => color);
  const contentData = legendData.map(({ name }) => {
    const foundAttribute = chartContent.find(({ x }) => x === name);
    return { x: name, y: foundAttribute.y };
  });

  const labelControl = (
    <LabelContainer smScreen={mediaMax960} mdScreen={mediaMax1280}>
      <Label content={centerLabel.label} />
      {centerLabel.category !== 'beltfish' ? (
        <Label content={centerLabel.number && `${centerLabel.number.toFixed(1)}%`} />
      ) : (
        <Label content={centerLabel.number && `${centerLabel.number.toFixed(1)}kg/ha`} />
      )}
    </LabelContainer>
  );

  const privateLabelControl = setToPrivate && (
    <PrivateLabelContainer mdScreen={mediaMax1280}>
      <PrivateLabel content={privateLabel} />
    </PrivateLabelContainer>
  );

  return (
    <div>
      {setToPrivate ? privateLabelControl : labelControl}
      <ChartWrapper mdScreen={mediaMax1280} policy={setToPrivate}>
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
          height={mediaMin1281 ? 500 : 220}
          itemsPerRow={mediaMin1281 || legendData.length <= 4 ? 1 : mediaMin960 ? 3 : 2}
          style={{
            labels: { fontSize: mediaMin1281 ? 20 : mediaMin960 ? 13 : 17 }
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
