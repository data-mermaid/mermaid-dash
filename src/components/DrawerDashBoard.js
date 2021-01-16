import React, { useContext } from 'react';

import ClearIcon from '@material-ui/icons/Clear';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import makeStyles from '@material-ui/core/styles/makeStyles';
import { ThemeProvider } from 'styled-components/macro';

import Drawer from '@material-ui/core/Drawer';
import Tooltip from '@material-ui/core/Tooltip';
import Fade from '@material-ui/core/Fade';
import Box from '@material-ui/core/Box';
import PropTypes from 'prop-types';

import { histogramContext } from '../context/histogramContext';
import MetricCards from './MetricCardsContainer';
import InformationCard from './InformationCard';
import SiteDetail from './SiteDetail';
import { color, theme } from '../constants/theme';
import { ButtonStyle } from '../styles/MermaidStyledComponents';
import {
  summary,
  histogram as histogramSummary,
  drawerWidth
} from '../constants/summary-information';
import SidePanelControl from './SidePanelControl';

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
    backgroundColor: color.mermaidWhiteGray,
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
  dropDownWrapperProperty: {
    display: 'flex',
    justifyContent: 'center',
    padding: '16px 8px 0 8px'
  },
  collapseButtonProperty: {
    position: 'fixed',
    top: 66,
    right: 650,
    zIndex: 1000,
    [theme.breakpoints.down('sm')]: {
      right: 400
    },
    [theme.breakpoints.up('md')]: {
      right: 500
    },
    [theme.breakpoints.up('lg')]: {
      right: 650
    }
  },
  clearSelectionButtonProperty: {
    position: 'fixed',
    top: 130,
    right: 650,
    zIndex: 1000,
    [theme.breakpoints.down('sm')]: {
      right: 400
    },
    [theme.breakpoints.up('md')]: {
      right: 500
    },
    [theme.breakpoints.up('lg')]: {
      right: 650
    }
  }
}));

const DrawerDashBoard = ({
  sidePanelOpen,
  handleDrawerChange,
  isLoading,
  showSiteDetail,
  metrics,
  siteDetail,
  clearSelectedSiteHandler,
  hideDrawer,
  isFiltering,
  projectFishFamilies
}) => {
  const { histogram } = useContext(histogramContext);
  const classes = drawerStyleProperties();

  const collapseSidePanel = (
    <Box className={classes.collapseButtonProperty}>
      <ThemeProvider theme={theme.sidePanelControl}>
        <Tooltip
          title="Hide"
          placement="left"
          TransitionComponent={Fade}
          TransitionProps={{ timeout: 200 }}
        >
          <ButtonStyle onClick={handleDrawerChange}>
            <ChevronRightIcon />
          </ButtonStyle>
        </Tooltip>
      </ThemeProvider>
    </Box>
  );

  const clearSelectedSite = showSiteDetail && (
    <Box className={classes.clearSelectionButtonProperty}>
      <ThemeProvider theme={theme.sidePanelControl}>
        <Tooltip
          title="Clear selection"
          placement="left"
          TransitionComponent={Fade}
          TransitionProps={{ timeout: 200 }}
        >
          <ButtonStyle onClick={clearSelectedSiteHandler}>
            <ClearIcon />
          </ButtonStyle>
        </Tooltip>
      </ThemeProvider>
    </Box>
  );

  const dashboard = (
    <div className={classes.summaryDashboardProperty}>
      <InformationCard
        title={summary.title}
        type={summary.type}
        textContent={summary}
        isFiltering={isFiltering}
      />
      <MetricCards metrics={metrics} isLoading={isLoading} />
      <InformationCard
        title={histogramSummary.title}
        type={histogramSummary.type}
        histogramContent={histogram}
        isFiltering={isFiltering}
      />
    </div>
  );

  const siteDashboard = siteDetail && (
    <SiteDetail selectSite={siteDetail} projectFishFamilies={projectFishFamilies} />
  );

  const result = sidePanelOpen ? (
    <>
      {collapseSidePanel}
      {clearSelectedSite}
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="right"
        open={sidePanelOpen}
        classes={{
          paper: classes.drawerPaper
        }}
      >
        {showSiteDetail ? siteDashboard : dashboard}
      </Drawer>
    </>
  ) : (
    <SidePanelControl
      showSiteDetail={showSiteDetail}
      sidePanelOpen={sidePanelOpen}
      hideDrawer={hideDrawer}
      handleDrawerChange={handleDrawerChange}
      clearSelectedSiteHandler={clearSelectedSiteHandler}
    />
  );

  return <>{result}</>;
};

DrawerDashBoard.propTypes = {
  sidePanelOpen: PropTypes.bool,
  isLoading: PropTypes.bool,
  showSiteDetail: PropTypes.bool,
  metrics: PropTypes.array,
  siteDetail: PropTypes.object,
  clearSelectedSiteHandler: PropTypes.func,
  classes: PropTypes.object
};

export default DrawerDashBoard;
