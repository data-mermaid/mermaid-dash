import React from 'react';

import ClearIcon from '@material-ui/icons/Clear';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

import makeStyles from '@material-ui/core/styles/makeStyles';
import { ThemeProvider } from 'styled-components/macro';

import Tooltip from '@material-ui/core/Tooltip';
import Fade from '@material-ui/core/Fade';
import Box from '@material-ui/core/Box';

import { theme } from './theme';
import { ButtonStyle } from '../styles/MermaidStyledComponents';

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

const SidePanelControl = ({ showSiteDetail, backButtonHandler, handleDrawerChange }) => {
  const classes = sidePanelStyleProperties();

  const showPanelControl = (
    <Box className={classes.showPanelButtonProperty}>
      <ThemeProvider theme={theme.sidePanelCOntrol}>
        <Tooltip
          title="Show"
          placement="left"
          TransitionComponent={Fade}
          TransitionProps={{ timeout: 300 }}
        >
          <ButtonStyle onClick={handleDrawerChange}>
            <ChevronLeftIcon />
          </ButtonStyle>
        </Tooltip>
      </ThemeProvider>
    </Box>
  );

  const clearSelectedSite = showSiteDetail && (
    <Box className={classes.clearSiteButtonProperty}>
      <ThemeProvider theme={theme.sidePanelCOntrol}>
        <Tooltip
          title="Clear selection"
          placement="left"
          TransitionComponent={Fade}
          TransitionProps={{ timeout: 300 }}
        >
          <ButtonStyle onClick={backButtonHandler}>
            <ClearIcon />
          </ButtonStyle>
        </Tooltip>
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
