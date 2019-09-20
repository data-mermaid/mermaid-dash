import React from 'react';

import Drawer from '@material-ui/core/Drawer';
import BackArrowIcon from '@material-ui/icons/ArrowBack';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { ThemeProvider } from 'styled-components/macro';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

import MetricCards from './MetricCardsContainer';
import InformationCard from './InformationCard';
import SiteDetail from './SiteDetail';
import DropDown from './DropDown';
import { theme } from './theme';
import { ButtonStyle } from '../styles/MermaidStyledComponents';
import { summary, histogram, drawerWidth } from '../constants/summary-information';

import PropTypes from 'prop-types';

const drawerStyleProperties = makeStyles(theme => ({
  summaryDashboardProperty: {
    paddingBottom: theme.spacing(8)
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth,
    top: 49
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start'
  },
  siteDetailControlProperty: {
    display: 'flex',
    justifyContent: 'flex-start',
    padding: '16px 8px 0 8px'
  }
}));

const DrawerDashBoard = ({
  open,
  isLoading,
  showDropDown,
  showSiteDetail,
  metrics,
  histogramContent,
  siteDropDownData,
  siteDetail,
  siteClickHandler,
  backButtonHandler
}) => {
  const classes = drawerStyleProperties();

  const backButton = (
    <Box>
      <ThemeProvider theme={theme.backButton}>
        <ButtonStyle translateHover={true} boxShadow={true} onClick={backButtonHandler}>
          <BackArrowIcon />
          <Typography variant="h6">Back</Typography>
        </ButtonStyle>
      </ThemeProvider>
    </Box>
  );

  const dashboard = (
    <div className={classes.summaryDashboardProperty}>
      <InformationCard title={summary.title} type={summary.type} textContent={summary} />
      <MetricCards metrics={metrics} isLoading={isLoading} />
      <InformationCard
        title={histogram.title}
        type={histogram.type}
        histogramContent={histogramContent}
      />
    </div>
  );

  const dropDownSites = siteDropDownData.length > 0 && showDropDown && (
    <DropDown
      siteList={siteDropDownData}
      selectSite={siteDetail}
      siteClickHandler={siteClickHandler}
    />
  );

  const siteDashboard = siteDetail && (
    <div>
      <SiteDetail selectSite={siteDetail} />
    </div>
  );

  const siteControlArea = showSiteDetail && (
    <Box className={classes.siteDetailControlProperty}>
      {backButton}
      {dropDownSites}
    </Box>
  );

  return (
    <Drawer
      className={classes.drawer}
      variant="persistent"
      anchor="right"
      open={open}
      classes={{
        paper: classes.drawerPaper
      }}
    >
      {siteControlArea}
      {showSiteDetail ? siteDashboard : dashboard}
    </Drawer>
  );
};

DrawerDashBoard.propTypes = {
  open: PropTypes.bool,
  isLoading: PropTypes.bool,
  showDropDown: PropTypes.bool,
  showSiteDetail: PropTypes.bool,
  metrics: PropTypes.array,
  histogramContent: PropTypes.array,
  siteDropDownData: PropTypes.array,
  siteDetail: PropTypes.object,
  siteClickHandler: PropTypes.func,
  backButtonHandler: PropTypes.func,
  classes: PropTypes.object
};

export default DrawerDashBoard;
