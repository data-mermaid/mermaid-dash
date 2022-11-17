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
import FishFamilyModal from './FishFamilyModal';

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
  bleachingProtocolSubItems,
  dataPolicy,
  histogramContent,
  isFiltering,
  isPrivatePolicy,
  protocol,
  protocolName,
  title,
  type,
  pieChartContent,
  textContent,
  projectFishFamilies
}) => {
  const classes = cardStyle();
  const loaderType = type === 'text' ? <TextLoader /> : <ChartLoader />;

  const [modalStageOpen, setModalStage] = useState(false);
  const [fishFamilyModalStageOpen, setFishFamilyModalStageOpen] = useState(false);

  const modalToggleHandler = () => setModalStage(!modalStageOpen);
  const fishFamilyModalToggleHandler = () => setFishFamilyModalStageOpen(!fishFamilyModalStageOpen);

  const subAttributeItem = !isPrivatePolicy && protocol && (
    <>
      <Typography m={1}>Sample units: {protocol.sample_unit_count} </Typography>
      {protocolName === 'benthiclit' || protocolName === 'benthicpit' ? (
        <Typography m={1}>
          Hard coral cover: {protocol.percent_cover_by_benthic_category_avg['Hard coral']}%
        </Typography>
      ) : (
        <Typography m={1}>Reef fish biomass: {protocol.biomass_kgha_avg} kg/ha</Typography>
      )}
      {protocolName === 'beltfish' && projectFishFamilies.length > 0 && (
        <>
          <Typography m={1} display="inline">
            Restricted set of fish families surveyed{' '}
          </Typography>
          <FishFamilyModal
            open={fishFamilyModalStageOpen}
            modalToggleHandler={fishFamilyModalToggleHandler}
            projectFishFamilies={projectFishFamilies}
          />
        </>
      )}
    </>
  );

  const bleachingSubAttributeItem = !isPrivatePolicy && bleachingProtocolSubItems && (
    <>
      <Typography m={1}>
        Bleached colonies: {bleachingProtocolSubItems.percent_bleached_avg.toFixed(1)}%
      </Typography>
      <Typography m={1}>Hard coral genera: {bleachingProtocolSubItems.count_genera_avg}</Typography>
      <Typography m={1}>
        Observed coral colonies: {bleachingProtocolSubItems.count_total_avg}
      </Typography>
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

  const contentItem =
    type === 'text' ? (
      <CartTextContent textContent={textContent} />
    ) : (
      <CardChartContent
        chartType={type}
        protocolName={protocolName}
        pieChartContent={pieChartContent}
        isPrivatePolicy={isPrivatePolicy}
        title={title}
        histogramContent={histogramContent}
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
        </Box>
        {contentItem}
      </Paper>
    ) : (
      <Paper className={classes.cardWrapper}>{loaderType}</Paper>
    );

  return <CardDiv setPaddingOff={type === 'pieChart'}>{cardContent}</CardDiv>;
};

InformationCard.propTypes = {
  bleachingProtocolSubItems: PropTypes.object,
  dataPolicy: PropTypes.string,
  histogramContent: PropTypes.array,
  isFiltering: PropTypes.bool,
  isPrivatePolicy: PropTypes.bool,
  pieChartContent: PropTypes.array,
  projectFishFamilies: PropTypes.array,
  protocol: PropTypes.object,
  protocolName: PropTypes.string,
  textContent: PropTypes.object,
  title: PropTypes.string,
  type: PropTypes.string
};

export default InformationCard;
