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
  height: ${props => (props.smScreen ? '420px' : props.mdScreen ? '540px' : '100%')};
  display: flex;
  flex-direction: ${props => (props.mdScreen ? 'column' : 'row')};
  filter: ${props => props.policy && 'blur(0.8rem)'};
`;

const PieChart = ({ chartContent, setToPrivate, privateLabel }) => {
  const [centerLabel, setCenterLabel] = useState({ number: null, label: null, category: null });
  const mediaMax960 = useMediaQuery('(max-width:960px');
  const mediaMin961 = useMediaQuery('(min-width:961px)');
  const mediaMax1280 = useMediaQuery('(max-width:1280px)');
  const mediaBetween961And1280 = mediaMin961 && mediaMax1280;
  const pieChartContent = chartContent.data;
  const legendTitle = chartContent.title;

  const benthicAttributeCollection = pieChartContent.map(({ x }) => x);
  const filteredAttributeCollection = attributeColors.filter(({ name }) =>
    benthicAttributeCollection.includes(name)
  );

  const legendData = filteredAttributeCollection.map(({ name }) => ({ name }));
  const benthicsColorScale = filteredAttributeCollection.map(({ color }) => color);
  const contentData = legendData.map(({ name }) => {
    const foundAttribute = pieChartContent.find(({ x }) => x === name);
    return { x: name, y: foundAttribute.y };
  });

  const labelControl = (
    <LabelContainer smScreen={mediaMax960} mdScreen={mediaMax1280}>
      <Label content={centerLabel.label} />
      {centerLabel.category !== 'Tropic group' ? (
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
      <ChartWrapper smScreen={mediaMax960} mdScreen={mediaMax1280} policy={setToPrivate}>
        <VictoryPie
          innerRadius={90}
          height={mediaMax1280 ? 300 : 360}
          width={mediaMax1280 ? 400 : 400}
          padding={mediaMax1280 ? 30 : 60}
          labels={() => null}
          colorScale={setToPrivate ? privateColorScale : benthicsColorScale}
          data={setToPrivate ? pieChartContent : contentData}
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
                          category: legendTitle,
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
          title={legendTitle}
          orientation="horizontal"
          itemsPerRow={mediaBetween961And1280 ? 3 : 2}
          y={mediaMax1280 ? 0 : 50}
          style={{
            title: { fontSize: mediaMax1280 ? 18 : 23 },
            labels: { fontSize: mediaMax1280 ? 13 : 17 }
          }}
          data={legendData}
        />
      </ChartWrapper>
    </div>
  );
};

PieChart.propTypes = {
  chartContent: PropTypes.shape({
    title: PropTypes.string,
    data: PropTypes.array
  }),
  setToPrivate: PropTypes.bool,
  privateLabel: PropTypes.string
};

export default PieChart;
