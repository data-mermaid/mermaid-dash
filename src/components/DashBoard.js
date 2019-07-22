import React from 'react';

import BackArrowIcon from '@material-ui/icons/ArrowBack';
import { ReactComponent as SinglePointIcon } from '../Icons/circular-shape-silhouette.svg';
import { ReactComponent as MultiPointsIcon } from '../Icons/four.svg';

import { ThemeProvider } from 'styled-components/macro';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import { ButtonStyle } from './Button';
import MetricCards from './MetricCards';
import Card from './Card';
import SiteDetail from './SiteDetail';
import Samples from '../sample_data/sampleSummaryStatistic';

import PropTypes from 'prop-types';

const theme = {
  fg: '#2C3742',
  border: '0px',
  position: 'fixed',
  width: '70px',
  padding: '5px',
  transition: '0.3s ease-out',
  transform: 'translate(-5%, 0%)',
  shadow:
    '0px 1px 3px 0px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 2px 1px -1px rgba(0,0,0,0.12)'
};

const gridStyleProperties = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2, 2),
    height: 'calc(100vh - 64px)',
    overflow: 'overlay'
  },
  dashBoardProperty: {
    position: 'relative'
  },
  backButtonWrapperProperty: {
    padding: '0 10px 0 0',
    height: 40,
    background: 'white'
  },
  backIconProperty: {
    marginRight: theme.spacing(1)
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
  legendIconProperty: {
    color: '#A53434',
    marginRight: theme.spacing(1)
  }
}));

const DashBoard = ({ showFullMap, showSiteDetail, backButtonHandler, siteDetail, metrics }) => {
  const classes = gridStyleProperties();

  const backButton = showSiteDetail ? (
    <ThemeProvider theme={theme}>
      <ButtonStyle setHover={true} onClick={backButtonHandler}>
        <BackArrowIcon />
        <Typography variant="h6">Back</Typography>
      </ButtonStyle>
    </ThemeProvider>
  ) : null;

  const siteDashboard = siteDetail ? (
    <div>
      <SiteDetail selectSite={siteDetail} />
      <Card content={Samples.chartData} />
      <Card content={Samples.chartData} />
    </div>
  ) : null;

  const dashboard = showFullMap ? (
    <div>
      <Card content={Samples.summary} />
      <MetricCards metrics={metrics} />
      <Card content={Samples.chartData} />
    </div>
  ) : null;

  const backButtonControl = showFullMap ? (
    <Box display="flex" justifyContent="flex-end" className={classes.backButtonWrapperProperty}>
      {backButton}
    </Box>
  ) : null;

  const dashboardControl = showFullMap ? (
    <Grid item sm={5} className={classes.dashBoardProperty}>
      {showSiteDetail ? siteDashboard : dashboard}
    </Grid>
  ) : null;

  return (
    <Grid container className={classes.root}>
      <Grid item sm={7}>
        {backButtonControl}
        <Paper className={classes.legendProperty}>
          <Box display="flex" flexDirection="column" className={classes.legendItemProperty}>
            <Box display="flex" m={1}>
              <SinglePointIcon width="25px" height="25px" className={classes.legendIconProperty} />
              <Typography variant="h6">Data Location</Typography>
            </Box>
            <Box display="flex" m={1}>
              <MultiPointsIcon width="25px" height="25px" className={classes.legendIconProperty} />
              <Typography variant="h6">Multiple Data Points</Typography>
            </Box>
          </Box>
        </Paper>
      </Grid>
      {dashboardControl}
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
