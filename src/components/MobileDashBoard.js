import React, { useState } from 'react';

import makeStyles from '@material-ui/core/styles/makeStyles';
import MetricCard from './MetricCard';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import { ReactComponent as SelectMarkerIcon } from '../styles/Icons/pin.svg';
import Box from '@material-ui/core/Box';

import Grid from '@material-ui/core/Grid';

const mobileDashBoardStyleProperties = makeStyles(theme => ({
  root: {
    position: 'fixed',
    width: '100%',
    bottom: 0,
    height: 'auto',
    zIndex: 1000,
    display: 'flex',
    paddingBottom: '20px'
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
    alignItems: 'center'
  },
  iconButtonStyle: {
    padding: 0
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
  clearSelectedSiteHandler
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
      <Box className={classes.siteNameProperty}>
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

  return (
    <div className={classes.root}>
      <Grid container spacing={1} className={classes.gridContainerStyle}>
        {showSiteDetail ? selectSite : cardList}
      </Grid>
    </div>
  );
};

export default MobileDashBoard;
