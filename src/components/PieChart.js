import React, { useState } from 'react';
import { VictoryPie, VictoryLegend } from 'victory';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const LabelContainer = styled('div')`
  position: relative;
  top: ${props => (props.smallScreen ? '165px' : props.mobileScreen ? '210px' : '165px')};
  left: ${props => (props.smallScreen ? '105px' : props.mobileScreen ? '160px' : '80px')};
  width: 140px;
  height: 50px;
`;
const PrivateLabelContainer = styled('div')`
  position: relative;
  top: ${props => (props.mobileScreen ? '210px' : '165px')};
  left: ${props => (props.mobileScreen ? '90px' : '150px')};
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

const ChartWrapper = styled('Box')`
  width: 100%;
  height: ${props => (props.smallScreen ? '420px' : props.mobileScreen ? '540px' : '100%')};
  display: flex;
  flex-direction: ${props => (props.mobileScreen ? 'column' : 'row')};
  filter: ${props => props.policy && 'blur(0.8rem)'};
`;

const defaultColorScale = [
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
];

const privateColorScale = [
  '#DCDCDC',
  '#D3D3D3',
  '#C0C0C0',
  '#A9A9A9',
  '#808080',
  '#696969',
  '#778899',
  '#708090'
];

const PieChart = ({ chartContent, chartLegend, setToPrivate, privateLabel }) => {
  const [centerLabel, setCenterLabel] = useState({ number: null, label: null, category: null });
  const mediaMax960 = useMediaQuery('(max-width:960px');
  const medianMax1280 = useMediaQuery('(max-width:1280px)');

  const labelControl = (
    <LabelContainer smallScreen={mediaMax960} mobileScreen={medianMax1280}>
      <Label content={centerLabel.label} />
      {centerLabel.category !== 'Tropic group' ? (
        <Label content={centerLabel.number && `${centerLabel.number.toFixed(1)}%`} />
      ) : (
        <Label content={centerLabel.number && `${centerLabel.number.toFixed(1)}kg/ha`} />
      )}
    </LabelContainer>
  );

  const privateLabelControl = setToPrivate && (
    <PrivateLabelContainer mobileScreen={medianMax1280}>
      <PrivateLabel content={privateLabel} />
    </PrivateLabelContainer>
  );

  return (
    <div>
      {setToPrivate ? privateLabelControl : labelControl}
      <ChartWrapper smallScreen={mediaMax960} mobileScreen={medianMax1280} policy={setToPrivate}>
        <VictoryPie
          innerRadius={90}
          height={medianMax1280 ? 300 : 360}
          width={medianMax1280 ? 400 : 400}
          padding={medianMax1280 ? 30 : 60}
          labels={() => null}
          colorScale={setToPrivate ? privateColorScale : defaultColorScale}
          data={chartContent}
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
                          category: chartLegend.title,
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
          colorScale={setToPrivate ? privateColorScale : defaultColorScale}
          title={chartLegend.title}
          orientation="horizontal"
          itemsPerRow={2}
          y={medianMax1280 ? 0 : 50}
          style={{
            title: { fontSize: medianMax1280 ? 18 : 23 },
            labels: { fontSize: medianMax1280 ? 13 : 17 }
          }}
          data={chartLegend.data}
        />
      </ChartWrapper>
    </div>
  );
};

PieChart.propTypes = {
  chartContent: PropTypes.array,
  chartLegend: PropTypes.shape({
    title: PropTypes.string,
    data: PropTypes.array
  })
};

export default PieChart;
