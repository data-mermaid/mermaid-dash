import React, { useState } from 'react';
import { VictoryPie, VictoryLegend } from 'victory';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import styled from 'styled-components';

import PropTypes from 'prop-types';

const LabelContainer = styled('div')`
  position: relative;
  top: ${props => (props.smallScreen ? '180px' : '190px')};
  left: ${props => (props.smallScreen ? '110px' : props.midScreen ? '190px' : '100px')};
  width: 180px;
  height: 50px;
`;
const PrivateLabelContainer = styled('div')`
  position: relative;
  top: 200px;
  left: ${props => (props.smallScreen ? '80px' : props.midScreen ? '130px' : '150px')};
  width: 60%;
  z-index: 1;
`;

const Label = styled('div')`
  opacity: ${props => (props.content ? 1 : 0)};
  transition: opacity 0.5s ease-in-out;
  text-align: center;
  font-size: 16px;
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

const ImageStyle = styled('div')`
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

const PieChart = ({ chartContent, chartLegend, chartPolicy }) => {
  const [centerLabel, setCenterLabel] = useState({ number: null, label: null });
  const mediaMax1299 = useMediaQuery('(max-width:1299px)');
  const mediaMin1300 = useMediaQuery('(min-width:1300px)');
  const mediaMax1600 = useMediaQuery('(max-width:1600px)');
  const mediaMin1300Max1600 = mediaMin1300 && mediaMax1600;
  const privatePolicyCheck = chartPolicy.name === 'Private';

  const labelControl = (
    <LabelContainer smallScreen={mediaMax1299} midScreen={mediaMin1300Max1600}>
      <Label content={centerLabel.label} />
      <Label content={centerLabel.number ? `${centerLabel.number}%` : centerLabel.number} />
    </LabelContainer>
  );

  const privateLabelControl = privatePolicyCheck && (
    <PrivateLabelContainer smallScreen={mediaMax1299} midScreen={mediaMin1300Max1600}>
      <PrivateLabel content={chartPolicy.privateLabel} />
    </PrivateLabelContainer>
  );

  return (
    <>
      {privateLabelControl}
      <ImageStyle policy={privatePolicyCheck}>
        {labelControl}
        <svg width="100%" height={mediaMax1299 ? 330 : 360}>
          <VictoryLegend
            standalone={mediaMax1600}
            colorScale={privatePolicyCheck ? privateColorScale : defaultColorScale}
            x={430}
            title={chartLegend.title}
            centerTitle
            style={{
              title: { fontSize: 20 }
            }}
            data={chartLegend.data}
          />
          <VictoryPie
            standalone={false}
            innerRadius={120}
            height={mediaMax1299 ? 300 : 300}
            width={mediaMax1299 ? 450 : 430}
            padding={{
              right: mediaMin1300Max1600 ? 0 : 80,
              left: mediaMin1300Max1600 ? 130 : 40
            }}
            labels={() => null}
            colorScale={privatePolicyCheck ? privateColorScale : defaultColorScale}
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
        </svg>
      </ImageStyle>
    </>
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
