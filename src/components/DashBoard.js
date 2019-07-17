import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { ReactComponent as SinglePointIcon } from '../Icons/circular-shape-silhouette.svg';
import { ReactComponent as MultiPointsIcon } from '../Icons/four.svg';

import SiteList from './SiteList';
import MetricCards from './MetricCards';
import Card from './Card';
import Samples from '../sample_data/sampleSummaryStatistic';

import PropTypes from 'prop-types';

const gridStyleProperties = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2, 2),
    height: 'calc(100vh - 64px)',
    overflow: 'overlay'
  },
  dashBoardProperty: {
    position: 'relative'
  },
  legendProperty: {
    position: 'fixed',
    width: 210,
    height: 160,
    bottom: 10,
    left: 270,
    color: 'white',
    opacity: 0.7,
    backgroundColor: 'black',
    borderRadius: 0
  },
  legendItemProperty: {
    padding: '35px 0 10px 0px'
  },
  iconProperty: {
    color: '#A53434',
    marginRight: '5px'
  }
}));

const DashBoard = ({ showFullMap, sites, siteSelectHandler, selectSite, metrics }) => {
  const classes = gridStyleProperties();

  const dashboard = showFullMap ? (
    <Grid item sm={5} className={classes.dashBoardProperty}>
      <Card content={Samples.summary} />
      <MetricCards metrics={metrics} />
      <SiteList sites={sites} siteSelectHandler={siteSelectHandler} selectSite={selectSite} />
      <Card content={Samples.chartData} />
    </Grid>
  ) : null;

  return (
    <Grid container className={classes.root}>
      <Grid item sm={7}>
        <Paper className={classes.legendProperty}>
          <Box display="flex" flexDirection="column" className={classes.legendItemProperty}>
            <Box display="flex" m={1}>
              <SinglePointIcon width="25px" height="25px" className={classes.iconProperty} />
              <Typography variant="h6">Data Location</Typography>
            </Box>
            <Box display="flex" m={1}>
              <MultiPointsIcon width="25px" height="25px" className={classes.iconProperty} />
              <Typography variant="h6">Multiple Data Points</Typography>
            </Box>
          </Box>
        </Paper>
      </Grid>
      {dashboard}
    </Grid>
  );
};

DashBoard.propTypes = {
  showFullMap: PropTypes.bool,
  sites: PropTypes.array,
  siteSelectHandler: PropTypes.func,
  selectSite: PropTypes.object,
  metrics: PropTypes.array,
  classes: PropTypes.object
};

export default DashBoard;
