import React from 'react'
import { VictoryPie, VictoryLegend, VictoryTooltip } from 'victory'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import styled, { css } from 'styled-components/macro'

import PropTypes from 'prop-types'
import { privateColorScale } from '../constants/attribute-colors'
import { pieChartContentPropType } from '../lib/mermaidDataPropTypes'
import {
  FISHBELT_SAMPLE_UNIT,
  sampleUnitAttributeColors,
} from '../constants/sample-unit-information'

const ChartWrapper = styled('div')`
  width: 100%;
  padding-top: 20px;
  display: flex;
  flex-direction: ${props => (props.mediaMin600_Max960 || !props.mediaMax1280 ? 'row' : 'column')};
  filter: ${props => props.policy && 'blur(0.8rem)'};
  @media (min-width: 600px) and (max-width: 960px) {
    flex-direction: row;
  }
`

const PrivateTextWrapper = styled('div')`
  position: relative;
  height: 0;
  width: 60%;
  top: ${props => (props.mediaMin600_Max960 ? '170px' : '180px')};
  left: ${props => (props.mediaMin960_Max1280 || props.mediaMax600 ? '100px' : '150px')};
  z-index: 1;
  user-select: none;
  text-align: center;
  font-size: large;
`

const SvgWrapper = styled('svg')`
  width: 360px;
  ${props =>
    props.setHeight &&
    css`
      height: 380px;
    `}
`

const PieChart = ({ sampleUnit, chartContent, isPrivatePolicy, title }) => {
  const mediaMin600 = useMediaQuery('(min-width:600px)')
  const mediaMax600 = useMediaQuery('(max-width:600px)')
  const mediaMax960 = useMediaQuery('(max-width:960px')
  const mediaMin960 = useMediaQuery('(min-width:960px)')
  const mediaMin1281 = useMediaQuery('(min-width:1281px)')
  const mediaMax1280 = useMediaQuery('(max-width:1280px)')
  const mediaMin600_Max960 = mediaMax960 && mediaMin600
  const mediaMin960_Max1280 = mediaMax1280 && mediaMin960

  const attributeCollection = chartContent.map(({ x, y }) => y !== 0 && x)
  const filteredAttributeCollection = sampleUnitAttributeColors[sampleUnit].filter(({ name }) =>
    attributeCollection.includes(name),
  )
  const attributeColorScale = filteredAttributeCollection.map(({ color }) => color)
  const contentData = filteredAttributeCollection.map(({ name }) => {
    const foundAttribute = chartContent.find(({ x }) => x === name)

    return { x: name, y: foundAttribute.y }
  })

  const labelUnit = sampleUnit === FISHBELT_SAMPLE_UNIT ? 'kg/ha' : '%'
  const legendData = contentData
    .filter(({ y }) => y > 0)
    .map(({ x }) => ({ name: x, symbol: { type: 'square' } }))

  const privateLabel = `This data is unavailable because ${title} Sample Units are set to Private for this project.`

  const privateLabelText = isPrivatePolicy && (
    <PrivateTextWrapper
      mediaMax600={mediaMax600}
      mediaMin600_Max960={mediaMin600_Max960}
      mediaMin960_Max1280={mediaMin960_Max1280}
    >
      {privateLabel}
    </PrivateTextWrapper>
  )

  const legendHeightMin600Max960 = mediaMin600_Max960 ? 310 : 140
  const legendHeight = mediaMin1281 ? 500 : legendHeightMin600Max960

  const legendFontSizeMin600Max960 = mediaMin600_Max960 ? 14 : 11
  const legendFontSize = mediaMin1281 ? 15 : legendFontSizeMin600Max960

  return (
    <>
      {privateLabelText}
      <ChartWrapper
        mediaMin600_Max960={mediaMin600_Max960}
        mediaMax1280={mediaMax1280}
        policy={isPrivatePolicy}
      >
        <VictoryPie
          animate={{
            duration: 2000,
          }}
          innerRadius={mediaMax1280 ? 90 : 110}
          height={mediaMax1280 ? 300 : 400}
          width={mediaMax1280 ? 400 : 450}
          padding={mediaMax1280 ? 30 : 50}
          labels={val => {
            return `${val.x} 
            ${val.y.toFixed(1)} ${labelUnit}`
          }}
          labelComponent={
            <VictoryTooltip
              x={mediaMax1280 ? 200 : 220}
              y={mediaMax1280 ? 190 : 230}
              orientation="top"
              pointerLength={0}
              flyoutStyle={{
                stroke: 'transparent',
                fill: 'transparent',
              }}
              style={{ textTransform: 'capitalize' }}
            />
          }
          colorScale={isPrivatePolicy ? privateColorScale : attributeColorScale}
          data={isPrivatePolicy ? chartContent : contentData}
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
                          transition: '0.25s ease-in-out',
                        },
                      }),
                    },
                    {
                      target: 'labels',
                      mutation: () => ({ active: true, fontSize: 30 }),
                    },
                  ]
                },
                onMouseOut: () => {
                  return [
                    {
                      target: 'data',
                      mutation: () => {},
                    },
                    {
                      target: 'labels',
                      mutation: () => ({ active: false }),
                    },
                  ]
                },
              },
            },
          ]}
        />
        <SvgWrapper setHeight={mediaMin600_Max960 || !mediaMax1280}>
          <VictoryLegend
            standalone={false}
            colorScale={isPrivatePolicy ? privateColorScale : attributeColorScale}
            orientation="horizontal"
            height={legendHeight}
            itemsPerRow={mediaMin1281 || mediaMin600_Max960 || legendData.length <= 4 ? 1 : 2}
            style={{
              labels: {
                fontSize: legendFontSize,
                fontFamily: 'Arial',
                textTransform: 'capitalize',
              },
            }}
            data={legendData}
          />
        </SvgWrapper>
      </ChartWrapper>
    </>
  )
}

PieChart.propTypes = {
  chartContent: pieChartContentPropType.isRequired,
  isPrivatePolicy: PropTypes.bool,
  sampleUnit: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
}

PieChart.defaultProps = {
  isPrivatePolicy: false,
}

export default PieChart
