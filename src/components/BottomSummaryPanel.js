import React, { useContext, useState } from 'react';

import makeStyles from '@material-ui/core/styles/makeStyles';
import styled, { css } from 'styled-components/macro';

import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import ExpandMoreIcon from '@material-ui/icons/ExpandLess';
import ExpandLessIcon from '@material-ui/icons/ExpandMore';
import { ReactComponent as SelectMarkerIcon } from '../styles/Icons/pin.svg';

import Box from '@material-ui/core/Box';

import { histogramContext } from '../context/histogramContext';

import PropTypes from 'prop-types';
import MetricCards from './MetricCardsContainer';
import InformationCard from './InformationCard';
import SiteDetail from './SiteDetail';
import { histogram as histogramSummary } from '../constants/summary-information';
import { color } from '../constants/theme';

const bottomPanelStyleProperties = makeStyles(theme => ({
  selectedSiteProperty: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    background: 'white',
    borderRadius: '4px',
    width: '96%',
    padding: '8px 0'
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
    padding: '0px'
  },
  siteControlIconButtonStyle: {
    padding: '10px'
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
  z-index: 1000;
  bottom: 0;
  width: 100%;
  height: auto;
  padding-bottom: 8px;
  ${props =>
    props.open &&
    css`
      top: 49px;
      background-color: ${color.mermaidWhiteGray};
      overflow-x: hidden;
      overflow-y: overlay;
    `}
`;

const BottomSummaryPanel = ({
  metrics,
  isLoading,
  showSiteDetail,
  siteDetail,
  clearSelectedSiteHandler
}) => {
  const { histogram } = useContext(histogramContext);
  const classes = bottomPanelStyleProperties();
  const [loadedSite, setLoadedSite] = useState(null);
  const [open, setOpen] = useState(false);

  if (siteDetail && (!loadedSite || loadedSite.site_id !== siteDetail.site_id))
    setLoadedSite(siteDetail);

  const toggleExpand = () => setOpen(!open);

  const summary = (
    <>
      <MetricCards metrics={metrics} isLoading={isLoading} bottomPanelOpen={open} />
      {open && (
        <InformationCard
          title={histogramSummary.title}
          type={histogramSummary.type}
          histogramContent={histogram}
        />
      )}
    </>
  );

  const selectedSiteName =
    loadedSite &&
    (open ? (
      <SiteDetail selectSite={loadedSite} />
    ) : (
      <Box className={classes.selectedSiteProperty}>
        <SelectMarkerIcon className={classes.selectMarkerIconStyle} />
        <Box className={classes.siteNameStyle}>
          {loadedSite.site_name} - {loadedSite.project_name}
        </Box>
        <IconButton className={classes.iconButtonStyle} onClick={clearSelectedSiteHandler}>
          <ClearIcon className={classes.clearIconStyle} />
        </IconButton>
      </Box>
    ));

  return (
    <BottomPanelContainer open={open}>
      <IconButton
        className={open ? classes.siteControlIconButtonStyle : classes.iconButtonStyle}
        onClick={toggleExpand}
      >
        {open ? <ExpandLessIcon /> : <ExpandMoreIcon className={classes.expandLessIcon} />}
      </IconButton>
      {showSiteDetail ? selectedSiteName : summary}
      {open && showSiteDetail && (
        <IconButton className={classes.iconButtonStyle} onClick={clearSelectedSiteHandler}>
          <ClearIcon />
        </IconButton>
      )}
    </BottomPanelContainer>
  );
};

BottomSummaryPanel.propTypes = {
  metrics: PropTypes.array,
  isLoading: PropTypes.bool,
  histogramContent: PropTypes.array,
  siteDetail: PropTypes.object,
  showSiteDetail: PropTypes.bool,
  clearSelectedSiteHandler: PropTypes.func
};

export default BottomSummaryPanel;
