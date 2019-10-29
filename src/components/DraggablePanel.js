import React, { useState } from 'react';

import makeStyles from '@material-ui/core/styles/makeStyles';
import MetricCards from './MetricCardsContainer';
import InformationCard from './InformationCard';
import SiteDetail from './SiteDetail';

import styled from 'styled-components/macro';
import Draggable from 'react-draggable';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import { ReactComponent as SelectMarkerIcon } from '../styles/Icons/pin.svg';
import Box from '@material-ui/core/Box';

import { histogram } from '../constants/summary-information';

const Container = styled('div')`
  position: fixed;
  width: 100%;
  height: 100%;
  bottom: 1;
  border-radius: 4px;
  z-index: 1000;
  justify-content: center;
  display: flex;
  background: #f4f4f4;
  padding-bottom: 50px;
  transition: transform 0.25s ease-out;
  .handle {
    width: 30px;
    height: 10px;
    background: #bababa;
    border-radius: 25px;
    margin-bottom: 10px;
    outline: none;
    cursor: pointer;
  }
`;

const Widget = styled.div`
  width: 30px;
  height: 10px;
  background: #bababa;
  border-radius: 25px;
  margin-bottom: 10px;
  outline: none;
  :focus {
    outline: none;
  }
  cursor: pointer;
`;

const TestDivWrapper = styled.div`
  height: 1000px;
  width: 100%;
  display: flex;
  overflow-y: scroll;
  flex-direction: column;
`;

const mobileDashBoardStyleProperties = makeStyles(theme => ({
  root: {
    width: '100%',
    height: 'auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: '10px'
  },
  siteNameProperty: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  selectIconStyle: {
    width: '14px',
    height: '14px',
    marginRight: '5px'
  },
  nameStyle: {
    fontWeight: 'bold'
  },
  iconButtonStyle: {
    padding: 0
  },
  clearIconStyle: {
    fontSize: '24px'
  },
  selectSiteStyle: {
    display: 'flex',
    background: 'white',
    borderRadius: '4px'
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
  const classes = mobileDashBoardStyleProperties();
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
      <MetricCards metrics={metrics} isLoading={isLoading} />
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
      <Box className={classes.siteNameProperty}>
        <SelectMarkerIcon className={classes.selectIconStyle} />
        <Box className={classes.nameStyle}>
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
      handle=".handle"
      onStop={handleStop}
      bounds={open && { top: responsiveDragPanelHeight - 10, left: 0, right: 0, bottom: 0 }}
      position={open ? { x: 0, y: responsiveDragPanelHeight } : dragPanelPosition}
    >
      <Container open={open}>
        <div className={classes.root}>
          <div className="handle" />
          <TestDivWrapper>
            <Grid item xs={12}>
              {showSiteDetail ? siteSelectRender : dashboard}
            </Grid>
          </TestDivWrapper>
        </div>
      </Container>
    </Draggable>
  );
};

export default DraggablePanel;
