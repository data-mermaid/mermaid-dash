import React from 'react';

import makeStyles from '@material-ui/core/styles/makeStyles';
import MetricCards from './MetricCardsContainer';
import MetricCard from './MetricCard';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

const mobileDashBoardStyleProperties = makeStyles(theme => ({
  root: {
    position: 'fixed',
    width: '100%',
    bottom: 0,
    height: '150px',
    zIndex: 1000
  },
  gridContainerStyle: {
    padding: theme.spacing(0, 1)
  },
  metricsProperty: {
    display: 'flex',
    flexDirection: 'row'
  },
  metricStyle: {
    border: '1px solid',
    margin: '4px',
    display: 'flex',
    flexDirection: 'column',
    whiteSpace: 'nowrap',
    alignItems: 'center',
    borderRadius: '4px',
    backgroundColor: '#F4F4F4'
  },
  titleStyle: {
    fontSize: '12px'
  },
  numberStyle: {
    color: '#5080ad',
    fontSize: '32px'
  }
}));
const MobileDashBoard = ({ isLoading, metrics }) => {
  const classes = mobileDashBoardStyleProperties();
  const cardList = metrics.map((card, index) => {
    return (
      <Grid item xs={4} key={index}>
        <MetricCard content={card} isLoading={isLoading} />
      </Grid>
    );
  });

  return (
    <div className={classes.root}>
      <Grid container spacing={1} className={classes.gridContainerStyle}>
        {cardList}
      </Grid>
    </div>
  );
};

export default MobileDashBoard;
