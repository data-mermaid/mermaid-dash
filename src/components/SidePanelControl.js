import PropTypes from 'prop-types'
import React from 'react'

import ClearIcon from '@material-ui/icons/Clear'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { ThemeProvider } from 'styled-components/macro'
import Box from '@material-ui/core/Box'
import { theme } from '../constants/theme'
import { ButtonStyle } from '../styles/MermaidStyledComponents'
import MermaidDashboardTooltip from './MermaidDashboardTooltip'

const sidePanelStyleProperties = makeStyles(() => ({
  showPanelButtonProperty: {
    position: 'fixed',
    top: 66,
    right: 0,
    zIndex: 1000,
  },
  clearSiteButtonProperty: {
    position: 'fixed',
    top: 130,
    right: 0,
    zIndex: 1000,
  },
}))

const SidePanelControl = ({
  showSiteDetail,
  clearSelectedSiteHandler,
  handleDrawerChange,
  sidePanelOpen,
  hideDrawer,
}) => {
  const classes = sidePanelStyleProperties()

  const showPanelControl = (sidePanelOpen || !hideDrawer) && (
    <Box className={classes.showPanelButtonProperty}>
      <ThemeProvider theme={theme.sidePanelControl}>
        <MermaidDashboardTooltip title="Show">
          <ButtonStyle onClick={handleDrawerChange}>
            <ChevronLeftIcon />
          </ButtonStyle>
        </MermaidDashboardTooltip>
      </ThemeProvider>
    </Box>
  )

  const clearSelectedSite = showSiteDetail && !hideDrawer && (
    <Box className={classes.clearSiteButtonProperty}>
      <ThemeProvider theme={theme.sidePanelControl}>
        <MermaidDashboardTooltip title="Clear selection" placement="left">
          <ButtonStyle onClick={clearSelectedSiteHandler}>
            <ClearIcon />
          </ButtonStyle>
        </MermaidDashboardTooltip>
      </ThemeProvider>
    </Box>
  )

  return (
    <div>
      {showPanelControl}
      {clearSelectedSite}
    </div>
  )
}

SidePanelControl.propTypes = {
  showSiteDetail: PropTypes.bool.isRequired,
  clearSelectedSiteHandler: PropTypes.func.isRequired,
  handleDrawerChange: PropTypes.func.isRequired,
  sidePanelOpen: PropTypes.bool.isRequired,
  hideDrawer: PropTypes.bool.isRequired,
}

export default SidePanelControl
