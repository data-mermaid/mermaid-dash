import React from 'react'

import styled from 'styled-components/macro'

import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'

import PropTypes from 'prop-types'
import MetricCard from './MetricCard'

const WrapperMetricCardsContainer = styled(Grid)`
  padding: 0 8px;
`
const WrapperMetricCardsBox = styled(Box)`
  width: 100%;
`

const MetricCards = ({ metrics, isLoading, bottomPanelOpen }) => {
  const cardList = metrics.map(card => {
    return (
      <Grid item xs={4} key={card.title}>
        <MetricCard content={card} isLoading={isLoading} bottomPanelOpen={bottomPanelOpen} />
      </Grid>
    )
  })

  return (
    <WrapperMetricCardsBox>
      <WrapperMetricCardsContainer container spacing={1}>
        {cardList}
      </WrapperMetricCardsContainer>
    </WrapperMetricCardsBox>
  )
}

MetricCards.propTypes = {
  metrics: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      count: PropTypes.number,
    }),
  ).isRequired,
  isLoading: PropTypes.bool.isRequired,
  bottomPanelOpen: PropTypes.bool,
}

MetricCards.defaultProps = {
  bottomPanelOpen: false,
}

export default MetricCards
