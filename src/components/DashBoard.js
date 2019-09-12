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
import Slide from '@material-ui/core/Slide';
import styled from 'styled-components/macro';

import { ButtonStyle } from './Button';
import { theme } from './theme';
import MetricCards from './MetricCardsContainer';
import InformationCard from './InformationCard';
import SiteDetail from './SiteDetail';
import DropDown from './DropDown';
import { summary, histogram } from '../constants/summary-information';

import PropTypes from 'prop-types';

const RootGrid = styled(Grid)`
  overflow-y: overlay;
  height: calc(100vh - 49px);
  &::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background-color: #ffffff;
  }

  &::-webkit-scrollbar {
    width: 10px;
    background-color: #ffffff;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #2d3641;
  }
`;

const gridStyleProperties = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2, 2)
  },
  dashBoardProperty: {
    position: 'relative',
    height: 0
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
  histogramContent,
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

  const dashboard = (
    <Slide direction="left" in={showFullMap} mountOnEnter unmountOnExit>
      <div>
        <InformationCard title={summary.title} type={summary.type} textContent={summary} />
        <MetricCards metrics={metrics} isLoading={isLoading} />
        <InformationCard
          title={histogram.title}
          type={histogram.type}
          histogramContent={histogramContent}
        />
      </div>
    </Slide>
  );

  const backButtonControl = (
    <Slide direction="left" in={showFullMap} mountOnEnter unmountOnExit>
      <Box display="flex" justifyContent="flex-end">
        {backButton}
      </Box>
    </Slide>
  );

  const fullMapControl = <Box className={classes.zoomOutIconWrapperProperty}>{fullMapToggle}</Box>;

  const dashboardControl = (
    <Slide direction="left" in={showFullMap} mountOnEnter unmountOnExit>
      <Grid item sm={4} className={classes.dashBoardProperty}>
        {showSiteDetail ? siteDashboard : dashboard}
      </Grid>
    </Slide>
  );

  return (
    <RootGrid container className={classes.root}>
      <Grid item sm={8}>
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
    </RootGrid>
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
