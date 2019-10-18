import React, { useState } from 'react';

import makeStyles from '@material-ui/core/styles/makeStyles';
import MetricCard from './MetricCard';
import { ThemeProvider } from 'styled-components/macro';

import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import { ReactComponent as SelectMarkerIcon } from '../styles/Icons/pin.svg';
import Box from '@material-ui/core/Box';

import Grid from '@material-ui/core/Grid';

import { theme } from './theme';
import { ButtonStyle } from '../styles/MermaidStyledComponents';

const mobileDashBoardStyleProperties = makeStyles(theme => ({
  root: {
    position: 'fixed',
    width: '100%',
    bottom: 0,
    height: 'auto',
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingBottom: '20px'
  },
  extendButtonStyle: {
    position: 'fixed',
    zIndex: 1000,
    bottom: 150
  },
  gridContainerStyle: {
    padding: '0 8px 0 8px'
  },
  titleStyle: {
    fontSize: '12px'
  },
  numberStyle: {
    color: '#5080ad',
    fontSize: '32px'
  },
  selectSiteStyle: {
    display: 'flex',
    background: 'white',
    borderRadius: '4px',
    alignItems: 'center'
  },
  siteNameProperty: {
    display: 'flex',
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer'
  },
  iconButtonStyle: {
    padding: 0
  },
  expandIconProperty: {
    width: '30px',
    height: '30px'
  },
  clearIconStyle: {
    fontSize: '30px'
  },
  selectIconStyle: {
    width: '14px',
    height: '14px',
    marginRight: '5px'
  },
  nameStyle: {
    fontWeight: 'bold'
  }
}));
const MobileDashBoard = ({
  isLoading,
  metrics,
  siteDetail,
  showSiteDetail,
  clearSelectedSiteHandler,
  toggleExpand,
  bottomPanelOpen
}) => {
  const classes = mobileDashBoardStyleProperties();
  const [loadedSite, setLoadedSite] = useState(null);

  if (siteDetail && (!loadedSite || loadedSite.id !== siteDetail.id)) {
    setLoadedSite(siteDetail);
  }

  const cardList = metrics.map((card, index) => {
    return (
      <Grid item xs={4} key={index}>
        <MetricCard content={card} isLoading={isLoading} />
      </Grid>
    );
  });

  const selectSite = loadedSite && (
    <Grid item xs={12} className={classes.selectSiteStyle}>
      <Box className={classes.siteNameProperty} onClick={toggleExpand}>
        <SelectMarkerIcon className={classes.selectIconStyle} />
        <Box className={classes.nameStyle}>
          {loadedSite.properties.site_name} - {loadedSite.properties.project_name}
        </Box>
      </Box>
      <IconButton className={classes.iconButtonStyle} onClick={clearSelectedSiteHandler}>
        <ClearIcon className={classes.clearIconStyle} />
      </IconButton>
    </Grid>
  );

  const extendButton = (
    <ThemeProvider theme={theme.expandLessButton}>
      <ButtonStyle onClick={toggleExpand}>
        <ExpandLessIcon className={classes.expandIconProperty} />
      </ButtonStyle>
    </ThemeProvider>
  );

  const extendedInfoButton = !showSiteDetail && (
    <Box className={classes.extendButtonStyle}>{extendButton}</Box>
  );

  return (
    !bottomPanelOpen && (
      <div className={classes.root}>
        {extendedInfoButton}
        <Grid container spacing={1} className={classes.gridContainerStyle}>
          {showSiteDetail ? selectSite : cardList}
        </Grid>
      </div>
    )
  );
};

export default MobileDashBoard;
