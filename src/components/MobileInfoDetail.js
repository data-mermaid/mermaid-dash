import React from 'react';

import makeStyles from '@material-ui/core/styles/makeStyles';
import styled from 'styled-components/macro';
import Box from '@material-ui/core/Box';
import Slide from '@material-ui/core/Slide';
import { ThemeProvider } from 'styled-components/macro';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { theme } from './theme';
import { ButtonStyle } from '../styles/MermaidStyledComponents';
import MetricCards from './MetricCardsContainer';
import InformationCard from './InformationCard';
import SiteDetail from './SiteDetail';

import { histogram } from '../constants/summary-information';

const mobileInfoStyleProperties = makeStyles(theme => ({
  expandMoreIconProperty: {
    padding: theme.spacing(1, 0)
  }
}));
const WrapperDiv = styled.div`
  position: fixed;
  width: 100%;
  height: calc(100vh - 49px);
  bottom: 0;
  z-index: 1000;
  background-color: white;
  border-radius: 4px;
  align-items: center;
  display: flex;
  flex-direction: column;
  overflow: scroll;
`;

const WrapperHistogramDiv = styled.div`
  width: 100%;
`;

const MobileInfoDetail = ({
  metrics,
  isLoading,
  siteDetail,
  showSiteDetail,
  histogramContent,
  bottomPanelOpen,
  toggleExpand
}) => {
  const classes = mobileInfoStyleProperties();
  const extendButton = (
    <ThemeProvider theme={theme.expandMoreButton}>
      <ButtonStyle onClick={toggleExpand}>
        <ExpandMoreIcon className={classes.expandIconProperty} />
      </ButtonStyle>
    </ThemeProvider>
  );

  const collapseInfoButton = <Box className={classes.expandMoreIconProperty}>{extendButton}</Box>;
  const dashboard = (
    <>
      <MetricCards metrics={metrics} isLoading={isLoading} bottomPanelOpen={bottomPanelOpen} />
      <WrapperHistogramDiv>
        <InformationCard
          title={histogram.title}
          type={histogram.type}
          histogramContent={histogramContent}
        />
      </WrapperHistogramDiv>
    </>
  );

  const siteDashboard = siteDetail && <SiteDetail selectSite={siteDetail} />;
  return (
    <Slide direction="up" in={bottomPanelOpen} mountOnEnter unmountOnExit>
      <WrapperDiv>
        {collapseInfoButton}
        {showSiteDetail ? siteDashboard : dashboard}
      </WrapperDiv>
    </Slide>
  );
};

export default MobileInfoDetail;
