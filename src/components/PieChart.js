import React, { useState } from 'react';
import { VictoryPie, VictoryLegend } from 'victory';
import styled from 'styled-components';

// import PropTypes from 'prop-types';
const LabelContainer = styled('div')`
  position: relative;
  top: 190px;
  left: 100px;
  width: 180px;
`;

const LabelProperty = styled('p')`
  text-align: center;
  font-size: 16px;
`;

const NoLabelProperty = styled('p')`
  visibility: hidden;
  font-size: 16px;
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
  const labelControl =
    centerLabel.number || centerLabel.label ? (
      <LabelContainer>
        <LabelProperty>{centerLabel.label}</LabelProperty>
        <LabelProperty>{centerLabel.number}</LabelProperty>
      </LabelContainer>
    ) : (
      <LabelContainer>
        <NoLabelProperty>no label</NoLabelProperty>
        <NoLabelProperty>no label</NoLabelProperty>
      </LabelContainer>
    );

  return (
    <>
      {labelControl}
      <svg width="100%" height={360}>
        <VictoryLegend
          standalone={false}
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
          height={300}
          width={430}
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
                        style: { fill: 'smoke', opacity: 0.6, cursor: 'pointer' }
                      })
                    }
                  ];
                },
                onMouseOut: () => {
                  return [
                    {
                      target: 'data',
                      mutation: data => {
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
