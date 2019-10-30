import React from 'react';

import styled from 'styled-components/macro';

import Grid from '@material-ui/core/Grid';

import PropTypes from 'prop-types';
import MetricCard from './MetricCard';

const WrapperMetricCardsContainer = styled(Grid)`
  padding: 0 8px;
`;

const MetricCards = ({ metrics, isLoading, bottomPanelOpen }) => {
  const cardList = metrics.map((card, index) => {
    return (
      <Grid item xs={4} key={index}>
        <MetricCard content={card} isLoading={isLoading} bottomPanelOpen={bottomPanelOpen} />
      </Grid>
    );
  });

  return (
    <WrapperMetricCardsContainer container spacing={1}>
      {cardList}
    </WrapperMetricCardsContainer>
  );
};

MetricCards.propTypes = {
  metrics: PropTypes.array,
  isLoading: PropTypes.bool,
  bottomPanelOpen: PropTypes.bool
};

export default MetricCards;
