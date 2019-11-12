import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import styled from 'styled-components/macro';

import { TextLoader, ChartLoader } from './Loader';
import CardChartContent from './CardChartContent';
import CartTextContent from './CardTextContent';
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
  }
}));

const InformationCard = ({
  dataPolicy,
  protocol,
  protocolName,
  setToPrivate,
  privateLabel,
  histogramContent,
  title,
  type,
  bleachingSubItems,
  pieChartContent,
  textContent
}) => {
  const classes = cardStyle();
  const loaderType = type === 'text' ? <TextLoader /> : <ChartLoader />;
  const findHardCoralValue = coral => {
    const hardCoralResult = coral
      .map(item => {
        return item['Hard coral'] ? item['Hard coral'] : 0;
      })
      .reduce((acc, val) => acc + val, 0);
    const hardCoralPercentage = hardCoralResult * 100;

    return hardCoralPercentage.toFixed(1);
  };

  const subAttributeItem = !setToPrivate && (
    <>
      <Typography m={1}>Sample units: {protocol && protocol.sample_unit_count} </Typography>
      {protocolName === 'benthiclit' || protocolName === 'benthicpit' ? (
        <Typography m={1}>Hard coral cover: {findHardCoralValue(protocol.coral_cover)}%</Typography>
      ) : (
        <Typography m={1}>
          Reef fish biomass: {protocolName === 'beltfish' && protocol.biomass_kgha} kg/ha
        </Typography>
      )}
    </>
  );

  const bleachingSubAttributeItem = !setToPrivate && bleachingSubItems && (
    <>
      <Typography m={1}>
        Bleached colonies: {bleachingSubItems.avg_percent_bleached.toFixed(1)}%
      </Typography>
      <Typography m={1}>Hard coral genera: {bleachingSubItems.avg_count_genera}</Typography>
      <Typography m={1}>Observed coral colonies: {bleachingSubItems.avg_count_total}</Typography>
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
      />
    );

  const cardContent =
    histogramContent || pieChartContent || textContent ? (
      <Paper className={classes.cardWrapper}>
        <Box display="flex" borderBottom={1}>
          <Box flexGrow={1}>
            <Box>
              <Typography variant="h4">{title}</Typography>
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
