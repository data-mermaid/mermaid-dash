import React from 'react'
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTooltip, VictoryLine } from 'victory'
import { color } from '../constants/theme'
import { histogramContentPropType } from '../lib/mermaidDataPropTypes'

const calculateYs = content => {
  return content.reduce((total, info) => {
    return total + info.y
  }, 0)
}

const BarChart = ({ chartContent }) => {
  const nonZeroContent = calculateYs(chartContent)

  return (
    <VictoryChart domainPadding={3}>
      <VictoryAxis
        label="% Hard Coral Cover"
        tickValues={[11, 21, 31, 41, 51, 61, 71, 81, 91, 100]}
        tickFormat={['10', '20', '30', '40', '50', '60', '70', '80', '90', '100']}
        style={{
          tickLabels: { fontSize: 10, padding: 8 },
        }}
      />

      <VictoryAxis
        dependentAxis
        label="Number of Sites"
        tickValues={nonZeroContent > 0 ? [] : ['0', '20', '40', '60']}
        style={{
          tickLabels: { fontSize: 10, padding: 5 },
        }}
      />

      <VictoryBar
        data={chartContent}
        barWidth={6}
        style={{
          data: {
            fill: data => {
              if (data.x < 11) {
                return '#d7191c'
              }

              if (data.x > 10 && data.x < 31) {
                return '#FFA500'
              }

              return '#038004'
            },
          },
        }}
        animate={{
          duration: 1000,
          onLoad: { duration: 500 },
          onEnter: { duration: 400, before: () => ({ y: 0 }) },
        }}
        labelComponent={
          <VictoryTooltip
            cornerRadius={4}
            pointerLength={7}
            flyoutStyle={{
              stroke: color.mermaidDarkBlue,
              strokeWidth: 2,
              fill: 'skyblue',
              opacity: 0.75,
            }}
            style={{
              padding: 6,
              fontSize: 12,
            }}
          />
        }
        events={[
          {
            target: 'data',
            eventHandlers: {
              onMouseOver: () => {
                return [
                  {
                    target: 'data',
                    mutation: () => ({ style: { fill: color.mermaidDarkBlue } }),
                  },
                  {
                    target: 'labels',
                    mutation: () => ({ active: true }),
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
        x="x"
        y="y"
      />
      <VictoryLine
        x={() => 11}
        style={{ data: { stroke: color.mermaidDarkBlue, strokeDasharray: [1, 2] } }}
      />
      <VictoryLine
        x={() => 31}
        style={{ data: { stroke: color.mermaidDarkBlue, strokeDasharray: [1, 2] } }}
      />
    </VictoryChart>
  )
}

BarChart.propTypes = {
  chartContent: histogramContentPropType.isRequired,
}

export default BarChart
