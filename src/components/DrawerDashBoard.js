import React from 'react';

import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import BackArrowIcon from '@material-ui/icons/ArrowBack';

import makeStyles from '@material-ui/core/styles/makeStyles';
import { ThemeProvider } from 'styled-components/macro';

import Drawer from '@material-ui/core/Drawer';
import Tooltip from '@material-ui/core/Tooltip';
import Fade from '@material-ui/core/Fade';
import Box from '@material-ui/core/Box';

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
    overflowX: 'hidden',
    paddingBottom: theme.spacing(8)
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    backgroundColor: '#F4F4F4',
    width: drawerWidth,
    top: 49,
    [theme.breakpoints.down('sm')]: {
      width: drawerWidth - 250
    },
    [theme.breakpoints.up('md')]: {
      width: drawerWidth - 150
    },
    [theme.breakpoints.up('lg')]: {
      width: drawerWidth
    }
  },
  siteDetailControlProperty: {
    display: 'flex',
    justifyContent: 'flex-start',
    padding: '16px 8px 0 8px'
  }
}));

const DrawerDashBoard = ({
  open,
  handleDrawerChange,
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
    <ThemeProvider theme={theme.backButton}>
      <ButtonStyle translateHover={true} boxShadow={true} onClick={backButtonHandler}>
        <BackArrowIcon />
        <Box fontSize={20} fontWeight="fontWeightBold">
          Back
        </Box>
      </ButtonStyle>
    </ThemeProvider>
  );

  const clearSelectedSite = (
    <Tooltip
      title="Clear selected site"
      placement="bottom"
      TransitionComponent={Fade}
      TransitionProps={{ timeout: 300 }}
    >
      <IconButton color="inherit" aria-label="clear select site" onClick={backButtonHandler}>
        <ClearIcon />
      </IconButton>
    </Tooltip>
  );

  const dropDownSites = siteDropDownData.length > 0 && showDropDown && (
    <DropDown
      siteList={siteDropDownData}
      selectSite={siteDetail}
      siteClickHandler={siteClickHandler}
    />
  );

  const collapseMenu = (
    <Tooltip
      title="Hide dashboard"
      placement="bottom"
      TransitionComponent={Fade}
      TransitionProps={{ timeout: 300 }}
    >
      <IconButton color="inherit" aria-label="open drawer" onClick={handleDrawerChange}>
        <ChevronRightIcon />
      </IconButton>
    </Tooltip>
  );

  const siteControls = (
    <Box className={classes.siteDetailControlProperty}>
      {collapseMenu}
      {clearSelectedSite}
      {dropDownSites}
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

  const siteDashboard = siteDetail && (
    <div>
      {siteControls}
      <SiteDetail selectSite={siteDetail} />
    </div>
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
