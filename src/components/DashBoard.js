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
import MetricCards from './MetricCardsContainer';
import Card from './Card';
import SiteDetail from './SiteDetail';
import DropDown from './DropDown';
import Samples from '../sample_data/sampleSummaryStatistic';

import PropTypes from 'prop-types';

const gridStyleProperties = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2, 2),
    height: 'calc(100vh - 49px)',
    overflow: 'overlay'
  },
  dashBoardProperty: {
    position: 'relative',
    height: 0
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
    top: 130,
    left: 10
  },
  legendProperty: {
    position: 'fixed',
    width: 220,
    height: 140,
    bottom: 10,
    left: 250,
    color: 'white',
    opacity: 0.6,
    backgroundColor: '#000000',
    borderRadius: 0,
    boxShadow: 'none'
  },
  legendItemProperty: {
    padding: '5px 0 10px 0px'
  },
  legendIconProperty: {
    margin: '3px 8px 0 4px'
  },
  legendMarkerIconProperty: {
    marginRight: '3px'
  },
  zoomOutIconProperty: {
    width: '16px',
    height: '16px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  divProperty: {
    // overflow: 'overlay'
  }
}));

const DashBoard = ({
  showFullMap,
  showSiteDetail,
  showDropDown,
  siteClickHandler,
  backButtonHandler,
  siteDetail,
  siteDropDownData,
  metrics,
  histogram,
  fullMapZoomHandler,
  isLoading
}) => {
  const classes = gridStyleProperties();

  const backButton = showSiteDetail && (
    <ThemeProvider theme={theme.backButton}>
      <ButtonStyle translateHover={true} boxShadow={true} onClick={backButtonHandler}>
        <BackArrowIcon />
        <Typography variant="h6">Back</Typography>
      </ButtonStyle>
    </ThemeProvider>
  );

  const fullMapToggle = (
    <ThemeProvider theme={theme.fullZoom}>
      <ButtonStyle
        buttonBorder={true}
        growScaleHover={true}
        onClick={() => fullMapZoomHandler(true)}
      >
        <ZoomOutIcon className={classes.zoomOutIconProperty} />
      </ButtonStyle>
    </ThemeProvider>
  );

  const dropDownSites = siteDropDownData.length > 0 && showDropDown && (
    <DropDown
      siteList={siteDropDownData}
      selectSite={siteDetail}
      siteClickHandler={siteClickHandler}
    />
  );

  const siteDashboard = siteDetail ? (
    <div>
      {dropDownSites}
      <SiteDetail selectSite={siteDetail} />
    </div>
  ) : (
    <div />
  );

  const dashboard = showFullMap && (
    <div className={classes.divProperty}>
      <Card title={'Summary Statistics'} type={'text'} body={Samples.summary.body} />
      <MetricCards metrics={metrics} isLoading={isLoading} />
      <Card histogram={histogram} title={'Live Coral Cover'} type={'barChart'} />
    </div>
  );

  const backButtonControl = showFullMap && (
    <Box display="flex" justifyContent="flex-end" className={classes.backButtonWrapperProperty}>
      {backButton}
    </Box>
  );

  const fullMapControl = <Box className={classes.zoomOutIconWrapperProperty}>{fullMapToggle}</Box>;

  const dashboardControl = showFullMap && (
    <Grid item sm={5} className={classes.dashBoardProperty} id="dashboard">
      {showSiteDetail ? siteDashboard : dashboard}
    </Grid>
  );

  return (
    <Grid container className={classes.root} id="grid-dashboard">
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
              <Typography variant="h6">Selected Project Site</Typography>
            </Box>
            <Box display="flex" m={1}>
              <SinglePointIcon width="22px" height="22px" className={classes.legendIconProperty} />
              <Typography variant="h6">Project Site</Typography>
            </Box>
            <Box display="flex" m={1}>
              <MultiPointsIcon width="22px" height="22px" className={classes.legendIconProperty} />
              <Typography variant="h6">Multiple Project Sites</Typography>
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
