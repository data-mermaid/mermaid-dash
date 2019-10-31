import React, { useState } from 'react';
import Draggable from 'react-draggable';

import makeStyles from '@material-ui/core/styles/makeStyles';
import styled from 'styled-components/macro';

import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import { ReactComponent as SelectMarkerIcon } from '../styles/Icons/pin.svg';

import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';

import PropTypes from 'prop-types';
import MetricCards from './MetricCardsContainer';
import InformationCard from './InformationCard';
import SiteDetail from './SiteDetail';
import { histogram } from '../constants/summary-information';

const DraggablePanelContainer = styled('div')`
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 4px;
  z-index: 2000;
  justify-content: center;
  display: flex;
  background: #f4f4f4;
  padding-bottom: 50px;
  transition: transform 0.25s ease-out;
`;

const Widget = styled('div')`
  width: 48px;
  height: 12px;
  background: #d3d3d3;
  border-radius: 25px;
  margin-bottom: 10px;
  outline: none;
  cursor: pointer;
`;

const PanelWrapper = styled('div')`
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 10px;
`;

const BottomSummaryWrapper = styled.div`
  height: 1000px;
  width: 100%;
  display: flex;
  overflow-x: hidden;
  overflow-y: overlay;
  flex-direction: column;
  .nodrag {
    outline: none;
  }
`;

const draggablePanelStyleProperties = makeStyles(theme => ({
  selectedSiteProperty: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
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

const DraggablePanel = ({
  metrics,
  isLoading,
  histogramContent,
  siteDetail,
  showSiteDetail,
  dragPanelPosition,
  clearSelectedSiteHandler
}) => {
  const classes = draggablePanelStyleProperties();
  const [open, setOpen] = useState(false);
  const [loadedSite, setLoadedSite] = useState(null);
  const responsiveDragPanelHeight = (window.innerHeight * -1020) / 1080;

  if (siteDetail && (!loadedSite || loadedSite.id !== siteDetail.id)) {
    setLoadedSite(siteDetail);
  }

  const handleStop = (evt, { y }) => {
    if (!open && y <= dragPanelPosition.y) {
      setOpen(true);
    } else if (open && y >= responsiveDragPanelHeight) {
      setOpen(false);
    }
  };

  const dashboard = (
    <>
      <MetricCards metrics={metrics} isLoading={isLoading} bottomPanelOpen={open} />
      <InformationCard
        title={histogram.title}
        type={histogram.type}
        histogramContent={histogramContent}
      />
    </>
  );

  const siteSelectRender =
    loadedSite &&
    (open ? (
      <SiteDetail selectSite={loadedSite} />
    ) : (
      <Box className={classes.selectedSiteProperty}>
        <SelectMarkerIcon className={classes.selectMarkerIconStyle} />
        <Box className={classes.siteNameStyle}>
          {loadedSite.properties.site_name} - {loadedSite.properties.project_name}
        </Box>
        <IconButton className={classes.iconButtonStyle} onClick={clearSelectedSiteHandler}>
          <ClearIcon className={classes.clearIconStyle} />
        </IconButton>
      </Box>
    ));

  return (
    <Draggable
      axis="y"
      cancel=".nodrag"
      onStop={handleStop}
      bounds={open && { top: responsiveDragPanelHeight - 10, left: 0, right: 0, bottom: 0 }}
      position={open ? { x: 0, y: responsiveDragPanelHeight } : dragPanelPosition}
    >
      <DraggablePanelContainer open={open}>
        <PanelWrapper>
          <Widget />
          <BottomSummaryWrapper className="nodrag">
            {showSiteDetail ? siteSelectRender : dashboard}
          </BottomSummaryWrapper>
        </PanelWrapper>
      </DraggablePanelContainer>
    </Draggable>
  );
};

DraggablePanel.propTypes = {
  metrics: PropTypes.array,
  isLoading: PropTypes.bool,
  histogramContent: PropTypes.array,
  siteDetail: PropTypes.object,
  showSiteDetail: PropTypes.bool,
  dragPanelPosition: PropTypes.shape({ y: PropTypes.number }),
  clearSelectedSiteHandler: PropTypes.func
};

export default DraggablePanel;
