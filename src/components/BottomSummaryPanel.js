import React, { useState } from 'react';

import makeStyles from '@material-ui/core/styles/makeStyles';
import styled from 'styled-components/macro';

import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
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
    width: '96%'
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
  },
  expandLessIcon: {
    color: 'white'
  }
}));

const BottomPanelContainer = styled('div')`
  position: fixed;
  display: flex;
  flex-direction: column;
  align-items: center;
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

  return (
    <BottomPanelContainer>
      <IconButton className={classes.iconButtonStyle}>
        <ExpandLessIcon className={classes.expandLessIcon} />
      </IconButton>
      {showSiteDetail ? selectedSiteName : summary}
    </BottomPanelContainer>
  );
};

export default BottomSummaryPanel;
