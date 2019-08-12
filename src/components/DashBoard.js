import React from 'react';

import BackArrowIcon from '@material-ui/icons/ArrowBack';
import ZoomOutIcon from '@material-ui/icons/ZoomOutMap';
import { ReactComponent as SinglePointIcon } from '../styles/Icons/circular-shape-silhouette.svg';
import { ReactComponent as MultiPointsIcon } from '../styles/Icons/four.svg';
import { ReactComponent as SelectMarkerIcon } from '../styles/Icons/pin.svg';

import { ThemeProvider } from 'styled-components/macro';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import { ButtonStyle } from './Button';
import { theme } from './theme';
import MetricCards from './MetricCards';
import Card from './Card';
import SiteDetail from './SiteDetail';
import Samples from '../sample_data/sampleSummaryStatistic';

import PropTypes from 'prop-types';

const gridStyleProperties = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2, 2),
    height: 'calc(100vh - 49px)',
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
  zoomOutIconWrapperProperty: {
    position: 'fixed',
    bottom: 30,
    left: 10
  },
  legendProperty: {
    position: 'fixed',
    width: 220,
    height: 140,
    bottom: 10,
    left: 250,
    color: 'white',
    opacity: 0.9,
    backgroundColor: '#585858',
    borderRadius: 0,
    boxShadow: 'none'
  },
  legendItemProperty: {
    padding: '5px 0 10px 0px'
  },
  legendIconProperty: {
    margin: '3px 8px 0 3px'
  },
  legendMarkerIconProperty: {
    marginRight: '3px'
  },
  zoomOutIconProperty: {
    width: '15px',
    height: '15px'
  }
}));

const DashBoard = ({
  showFullMap,
  showSiteDetail,
  backButtonHandler,
  siteDetail,
  metrics,
  fullMapZoomHandler
}) => {
  const classes = gridStyleProperties();

  const backButton = showSiteDetail && (
    <ThemeProvider theme={theme.backButton}>
      <ButtonStyle setHover={true} onClick={backButtonHandler}>
        <BackArrowIcon />
        <Typography variant="h6">Back</Typography>
      </ButtonStyle>
    </ThemeProvider>
  );

  const fullMapToggle = (
    <ThemeProvider theme={theme.fullZoom}>
      <ButtonStyle setHover={true} onClick={() => fullMapZoomHandler(true)}>
        <ZoomOutIcon className={classes.zoomOutIconProperty} />
      </ButtonStyle>
    </ThemeProvider>
  );

  const siteDashboard = siteDetail && (
    <div>
      <SiteDetail selectSite={siteDetail} />
      <Card content={Samples.benthicPieChartData} />
      <Card content={Samples.fishBeltPieChartData} />
    </div>
  );

  const dashboard = showFullMap && (
    <div>
      <Card content={Samples.summary} />
      <MetricCards metrics={metrics} />
      <Card content={Samples.barChartData} />
    </div>
  );

  const backButtonControl = showFullMap && (
    <Box display="flex" justifyContent="flex-end" className={classes.backButtonWrapperProperty}>
      {backButton}
    </Box>
  );

  const fullMapControl = <Box className={classes.zoomOutIconWrapperProperty}>{fullMapToggle}</Box>;

  const dashboardControl = showFullMap && (
    <Grid item sm={5} className={classes.dashBoardProperty}>
      {showSiteDetail ? siteDashboard : dashboard}
    </Grid>
  );

  return (
    <Grid container className={classes.root}>
      <Grid item sm={7}>
        {backButtonControl}
        {fullMapControl}
        <Paper className={classes.legendProperty}>
          <Box display="flex" flexDirection="column" className={classes.legendItemProperty}>
            <Box display="flex" m={1}>
              <SelectMarkerIcon
                width="30px"
                height="30px"
                className={classes.legendMarkerIconProperty}
              />
              <Typography variant="h6">Select Marker</Typography>
            </Box>
            <Box display="flex" m={1}>
              <SinglePointIcon width="22px" height="22px" className={classes.legendIconProperty} />
              <Typography variant="h6">Data Location</Typography>
            </Box>
            <Box display="flex" m={1}>
              <MultiPointsIcon width="22px" height="22px" className={classes.legendIconProperty} />
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
