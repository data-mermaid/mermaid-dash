import React, { useState } from 'react';

import makeStyles from '@material-ui/core/styles/makeStyles';
import styled from 'styled-components/macro';

import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import { ReactComponent as SelectMarkerIcon } from '../styles/Icons/pin.svg';

import Box from '@material-ui/core/Box';

import MetricCards from './MetricCardsContainer';

const bottomPanelStyleProperties = makeStyles(theme => ({
  selectedSiteProperty: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    background: 'white',
    borderRadius: '4px',
    margin: '0 8px 0 8px',
    padding: '4px 0 4px 0'
  },
  selectMarkerIconStyle: {
    width: '14px',
    height: '14px',
    marginRight: '5px'
  },
  siteNameStyle: {
    fontWeight: 'bold'
  },
  iconButtonStyle: {
    padding: 0
  },
  clearIconStyle: {
    fontSize: '24px'
  }
}));

const BottomPanelContainer = styled('div')`
  position: fixed;
  z-index: 2000;
  bottom: 0;
  width: 100%;
  height: auto;
  padding-bottom: 8px;
`;

const BottomSummaryPanel = ({
  metrics,
  isLoading,
  bottomPanelOpen,
  showSiteDetail,
  siteDetail,
  clearSelectedSiteHandler
}) => {
  const classes = bottomPanelStyleProperties();
  const [loadedSite, setLoadedSite] = useState(null);
  if (siteDetail && (!loadedSite || loadedSite.id !== siteDetail.id)) {
    setLoadedSite(siteDetail);
  }
  const summary = (
    <MetricCards metrics={metrics} isLoading={isLoading} bottomPanelOpen={bottomPanelOpen} />
  );

  const selectedSiteName = loadedSite && (
    <Box className={classes.selectedSiteProperty}>
      <SelectMarkerIcon className={classes.selectMarkerIconStyle} />
      <Box className={classes.siteNameStyle}>
        {loadedSite.properties.site_name} - {loadedSite.properties.project_name}
      </Box>
      <IconButton className={classes.iconButtonStyle} onClick={clearSelectedSiteHandler}>
        <ClearIcon className={classes.clearIconStyle} />
      </IconButton>
    </Box>
  );

  return <BottomPanelContainer>{showSiteDetail ? selectedSiteName : summary}</BottomPanelContainer>;
};

export default BottomSummaryPanel;
