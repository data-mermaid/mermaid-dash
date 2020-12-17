import React, { useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import styled from 'styled-components/macro';

import { TextLoader, ChartLoader } from './Loader';
import CardChartContent from './CardChartContent';
import CartTextContent from './CardTextContent';
import LiveCoralCoverModal from './LiveCoralCoverModal';
// import DownloadButton from './DownloadButton';

import PropTypes from 'prop-types';

const CardDiv = styled('div')`
  padding: ${props => (props.setPaddingOff ? '0 0 16px 0' : '16px 8px 16px 8px')};
  width: 100%;
`;

const cardStyle = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2, 1)
  },
  cardWrapper: {
    padding: theme.spacing(2, 1),
    borderRadius: 0
  },
  iconProperty: {
    paddingRight: '5px'
  },
  cardTitleProperty: {
    display: 'flex',
    alignItems: 'center'
  }
}));

const InformationCard = ({
  dataPolicy,
  protocol,
  protocolName,
  setToPrivate,
  privateLabel,
  histogramContent,
  isFiltering,
  title,
  type,
  bleachingSubItems,
  pieChartContent,
  textContent
}) => {
  const classes = cardStyle();
  const loaderType = type === 'text' ? <TextLoader /> : <ChartLoader />;

  const [modalStageOpen, setModalStage] = useState(false);

  const modalToggleHandler = () => setModalStage(!modalStageOpen);

  const subAttributeItem = !setToPrivate && protocol && (
    <>
      <Typography m={1}>Sample units: {protocol.sample_unit_count} </Typography>
      {protocolName === 'benthiclit' || protocolName === 'benthicpit' ? (
        <Typography m={1}>
          Hard coral cover: {protocol.percent_cover_by_benthic_category_avg['Hard coral']}%
        </Typography>
      ) : (
        <Typography m={1}>Reef fish biomass: {protocol.biomass_kgha_avg} kg/ha</Typography>
      )}
    </>
  );

  const bleachingSubAttributeItem = !setToPrivate && bleachingSubItems && (
    <>
      <Typography m={1}>
        Bleached colonies: {bleachingSubItems.percent_bleached_avg.toFixed(1)}%
      </Typography>
      <Typography m={1}>Hard coral genera: {bleachingSubItems.count_genera_avg}</Typography>
      <Typography m={1}>Observed coral colonies: {bleachingSubItems.count_total_avg}</Typography>
    </>
  );

  const protocolSubItem =
    protocolName === 'bleachingqc' ? bleachingSubAttributeItem : subAttributeItem;

  const subItems = type === 'pieChart' && (
    <Box>
      <Typography m={1}>Data sharing: {dataPolicy}</Typography>
      {protocolSubItem}
    </Box>
  );

  // eslint-disable-next-line
  // const downLoadButton = type === 'pieChart' && (
  //   <Box>
  //     <DownloadButton setToPrivate={setToPrivate}/>
  //   </Box>
  // );

  const contentItem =
    type === 'text' ? (
      <CartTextContent textContent={textContent} />
    ) : (
      <CardChartContent
        chartType={type}
        protocolName={protocolName}
        pieChartContent={pieChartContent}
        setToPrivate={setToPrivate}
        privateLabel={privateLabel}
        histogramContent={histogramContent}
        isFiltering={isFiltering}
      />
    );

  const cardContent =
    (histogramContent || pieChartContent || textContent) && !isFiltering ? (
      <Paper className={classes.cardWrapper}>
        <Box display="flex" borderBottom={1}>
          <Box flexGrow={1}>
            <Box className={classes.cardTitleProperty}>
              <Typography variant="h4">{title}</Typography>
              {type === 'histogramChart' && (
                <LiveCoralCoverModal
                  open={modalStageOpen}
                  modalToggleHandler={modalToggleHandler}
                />
              )}
            </Box>
            {subItems}
          </Box>
          {/* temporarily Hide download data buttons */}
          {/* {downLoadButton} */}
        </Box>
        {contentItem}
      </Paper>
    ) : (
      <Paper className={classes.cardWrapper}>{loaderType}</Paper>
    );

  return <CardDiv setPaddingOff={type === 'pieChart'}>{cardContent}</CardDiv>;
};

InformationCard.propTypes = {
  dataPolicy: PropTypes.string,
  protocol: PropTypes.object,
  protocolName: PropTypes.string,
  setToPrivate: PropTypes.bool,
  privateLabel: PropTypes.string,
  histogramContent: PropTypes.array,
  title: PropTypes.string,
  type: PropTypes.string,
  bleachingSubItems: PropTypes.object,
  pieChartContent: PropTypes.array,
  textContent: PropTypes.object,
  classes: PropTypes.object
};

export default InformationCard;
