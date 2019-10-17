import React, { useState } from 'react';

import makeStyles from '@material-ui/core/styles/makeStyles';
import MetricCard from './MetricCard';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
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
    alignItems: 'flex-end',
    paddingBottom: '15px'
  },
  gridContainerStyle: {
    padding: theme.spacing(0, 1)
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
    borderRadius: '4px'
  },
  iconButtonStyle: {
    padding: 0
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
      <Box flexGrow={1}>
        {loadedSite.properties.site_name} - {loadedSite.properties.project_name}
      </Box>
      <IconButton className={classes.iconButtonStyle} onClick={clearSelectedSiteHandler}>
        <ClearIcon fontSize="small" />
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
