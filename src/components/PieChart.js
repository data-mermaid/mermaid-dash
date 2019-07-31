import React, { useState } from 'react';
import { VictoryPie, VictoryLegend } from 'victory';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import styled from 'styled-components';

// import PropTypes from 'prop-types';
const LabelContainer = styled('div')`
  position: relative;
  top: ${props => (props.smallScreen ? '155px' : '190px')};
  left: ${props => (props.smallScreen ? '40px' : '100px')};
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
  const legendResponsive = useMediaQuery('(min-width:1600px)');
  const pieChartResponsive = useMediaQuery('(max-width:1000px)');

  const labelControl = (
    <LabelContainer smallScreen={pieChartResponsive}>
      <Label content={centerLabel.label} />
      <Label content={centerLabel.number} />
    </LabelContainer>
  );

  return (
    <>
      {labelControl}
      <svg width="100%" height={pieChartResponsive ? 300 : 360}>
        <VictoryLegend
          standalone={!legendResponsive}
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
          height={pieChartResponsive ? 250 : 300}
          width={pieChartResponsive ? 300 : 430}
          padding={{
            right: 80,
            left: 40
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

export default PieChart;
