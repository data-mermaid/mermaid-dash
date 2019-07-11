import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

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
  }
}));

const DashBoard = ({ showFullMap, sites, siteSelectHandler, selectSite, metrics }) => {
  const classes = gridStyleProperties();

  const dashboard = showFullMap ? (
    <Grid container className={classes.root}>
      <Grid item sm={7} />
      <Grid item sm={5} className={classes.dashBoardProperty}>
        <Card content={Samples.summary} />
        <MetricCards metrics={metrics} />
        <SiteList sites={sites} siteSelectHandler={siteSelectHandler} selectSite={selectSite} />
        <Card content={Samples.chartData} />
      </Grid>
    </Grid>
  ) : null;

  return <div>{dashboard}</div>;
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
