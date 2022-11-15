import React from 'react';

import ClearIcon from '@material-ui/icons/Clear';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

import makeStyles from '@material-ui/core/styles/makeStyles';
import { ThemeProvider } from 'styled-components/macro';

import Box from '@material-ui/core/Box';

import { theme } from '../constants/theme';
import { ButtonStyle } from '../styles/MermaidStyledComponents';
import TooltipLayout from './TooltipLayout';

const sidePanelStyleProperties = makeStyles(theme => ({
  showPanelButtonProperty: {
    position: 'fixed',
    top: 66,
    right: 0,
    zIndex: 1000
  },
  clearSiteButtonProperty: {
    position: 'fixed',
    top: 130,
    right: 0,
    zIndex: 1000
  }
}));

const SidePanelControl = ({
  showSiteDetail,
  clearSelectedSiteHandler,
  handleDrawerChange,
  sidePanelOpen,
  hideDrawer
}) => {
  const classes = sidePanelStyleProperties();

  const showPanelControl = (sidePanelOpen || !hideDrawer) && (
    <Box className={classes.showPanelButtonProperty}>
      <ThemeProvider theme={theme.sidePanelControl}>
        <TooltipLayout title="Show">
          <ButtonStyle onClick={handleDrawerChange}>
            <ChevronLeftIcon />
          </ButtonStyle>
        </TooltipLayout>
      </ThemeProvider>
    </Box>
  );

  const clearSelectedSite = showSiteDetail && !hideDrawer && (
    <Box className={classes.clearSiteButtonProperty}>
      <ThemeProvider theme={theme.sidePanelControl}>
        <TooltipLayout title="Clear selection" placement="left">
          <ButtonStyle onClick={clearSelectedSiteHandler}>
            <ClearIcon />
          </ButtonStyle>
        </TooltipLayout>
      </ThemeProvider>
    </Box>
  );

  return (
    <div>
      {showPanelControl}
      {clearSelectedSite}
    </div>
  );
};

export default SidePanelControl;
