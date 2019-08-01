import React, { useState } from 'react';
import { VictoryPie, VictoryLegend } from 'victory';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import styled from 'styled-components';

import PropTypes from 'prop-types';

const LabelContainer = styled('div')`
  position: relative;
  top: ${props => (props.smallScreen ? '180px' : '190px')};
  left: ${props => (props.smallScreen ? '115px' : props.midScreen ? '190px' : '100px')};
  width: 180px;
  height: 50px;
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

const PieChart = ({ chartContent, chartLegend }) => {
  const [centerLabel, setCenterLabel] = useState({ number: null, label: null });
  const mediaMax1600 = useMediaQuery('(max-width:1600px)');
  const mediaMax1050 = useMediaQuery('(max-width:1050px)');
  const mediaMin1350 = useMediaQuery('(min-width:1350px)');
  const mediaMin1350Max1600 = mediaMin1350 && mediaMax1600;

  const labelControl = (
    <LabelContainer smallScreen={mediaMax1050} midScreen={mediaMin1350Max1600}>
      <Label content={centerLabel.label} />
      <Label content={centerLabel.number ? `${centerLabel.number}%` : centerLabel.number} />
    </LabelContainer>
  );

  return (
    <>
      {labelControl}
      <svg width="100%" height={mediaMax1050 ? 330 : 360}>
        <VictoryLegend
          standalone={mediaMax1600}
          colorScale={defaultColorScale}
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
          height={mediaMax1050 ? 300 : 300}
          width={mediaMax1050 ? 450 : 430}
          padding={{
            right: mediaMin1350Max1600 ? 0 : 80,
            left: mediaMin1350Max1600 ? 130 : 40
          }}
          labels={() => null}
          colorScale={defaultColorScale}
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
                          cursor: 'pointer',
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
