import React, { useContext } from 'react'

import ClearIcon from '@material-ui/icons/Clear'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'

import makeStyles from '@material-ui/core/styles/makeStyles'
import { ThemeProvider } from 'styled-components/macro'

import Drawer from '@material-ui/core/Drawer'
import Fade from '@material-ui/core/Fade'
import Box from '@material-ui/core/Box'
import PropTypes from 'prop-types'

import { HistogramContext } from '../context/histogramContext'
import MetricCards from './MetricCards'
import InformationCard from './InformationCard'
import SiteDetail from './SiteDetail'
import { color, theme } from '../constants/theme'
import { ButtonStyle } from '../styles/MermaidStyledComponents'
import {
  summary,
  histogram as histogramSummary,
  drawerWidth,
} from '../constants/summary-information'
import SidePanelControl from './SidePanelControl'
import MermaidDashboardTooltip from './MermaidDashboardTooltip'
import { siteDetailPropType, sitesPropType } from '../lib/mermaidDataPropTypes'

const drawerStyleProperties = makeStyles(muiTheme => ({
  summaryDashboardProperty: {
    overflowX: 'hidden',
    paddingBottom: muiTheme.spacing(8),
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    backgroundColor: color.mermaidWhiteGray,
    width: drawerWidth,
    top: 49,
    [muiTheme.breakpoints.down('sm')]: {
      width: drawerWidth - 250,
    },
    [muiTheme.breakpoints.up('md')]: {
      width: drawerWidth - 150,
    },
    [muiTheme.breakpoints.up('lg')]: {
      width: drawerWidth,
    },
  },
  dropDownWrapperProperty: {
    display: 'flex',
    justifyContent: 'center',
    padding: '16px 8px 0 8px',
  },
  collapseButtonProperty: {
    position: 'fixed',
    top: 66,
    right: 650,
    zIndex: 1000,
    [muiTheme.breakpoints.down('sm')]: {
      right: 400,
    },
    [muiTheme.breakpoints.up('md')]: {
      right: 500,
    },
    [muiTheme.breakpoints.up('lg')]: {
      right: 650,
    },
  },
  clearSelectionButtonProperty: {
    position: 'fixed',
    top: 130,
    right: 650,
    zIndex: 1000,
    [muiTheme.breakpoints.down('sm')]: {
      right: 400,
    },
    [muiTheme.breakpoints.up('md')]: {
      right: 500,
    },
    [muiTheme.breakpoints.up('lg')]: {
      right: 650,
    },
  },
}))

const DrawerDashBoard = ({
  clearSelectedSiteHandler,
  handleDrawerChange,
  hideDrawer,
  isFiltering,
  isLoading,
  metrics,
  projectFishFamilies,
  showSiteDetail,
  sidePanelOpen,
  siteDetail,
  sites,
}) => {
  const { histogram } = useContext(HistogramContext)
  const classes = drawerStyleProperties()

  const collapseSidePanel = (
    <Box className={classes.collapseButtonProperty}>
      <ThemeProvider theme={theme.sidePanelControl}>
        <MermaidDashboardTooltip title="Hide" placement="left">
          <ButtonStyle onClick={handleDrawerChange}>
            <ChevronRightIcon />
          </ButtonStyle>
        </MermaidDashboardTooltip>
      </ThemeProvider>
    </Box>
  )

  const clearSelectedSite = showSiteDetail && (
    <Box className={classes.clearSelectionButtonProperty}>
      <ThemeProvider theme={theme.sidePanelControl}>
        <MermaidDashboardTooltip
          title="Clear selection"
          placement="left"
          TransitionComponent={Fade}
          TransitionProps={{ timeout: 200 }}
        >
          <ButtonStyle onClick={clearSelectedSiteHandler}>
            <ClearIcon />
          </ButtonStyle>
        </MermaidDashboardTooltip>
      </ThemeProvider>
    </Box>
  )

  const dashboard = (
    <div className={classes.summaryDashboardProperty}>
      <InformationCard
        isFiltering={isFiltering}
        textContent={summary}
        title={summary.title}
        type={summary.type}
      />
      <MetricCards metrics={metrics} isLoading={isLoading} />
      <InformationCard
        isFiltering={isFiltering}
        histogramContent={histogram}
        title={histogramSummary.title}
        type={histogramSummary.type}
      />
    </div>
  )

  const siteDashboard = siteDetail && (
    <SiteDetail selectSite={siteDetail} projectFishFamilies={projectFishFamilies} sites={sites} />
  )

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
          paper: classes.drawerPaper,
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
  )

  return <>{result}</>
}

DrawerDashBoard.propTypes = {
  clearSelectedSiteHandler: PropTypes.func.isRequired,
  handleDrawerChange: PropTypes.func.isRequired,
  hideDrawer: PropTypes.bool.isRequired,
  isFiltering: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  metrics: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      count: PropTypes.number,
    }),
  ).isRequired,
  projectFishFamilies: PropTypes.arrayOf(PropTypes.string),
  showSiteDetail: PropTypes.bool.isRequired,
  sidePanelOpen: PropTypes.bool.isRequired,
  siteDetail: PropTypes.arrayOf(siteDetailPropType),
  sites: sitesPropType.isRequired,
}

DrawerDashBoard.defaultProps = {
  projectFishFamilies: [],
  siteDetail: [],
}

export default DrawerDashBoard
