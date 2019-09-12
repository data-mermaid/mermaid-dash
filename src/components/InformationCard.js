import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import { TextLoader, ChartLoader } from './Loader';
import CardChartContent from './CardChartContent';
import CartTextContent from './CardTextContent';
import DownloadButton from './DownloadButton';

import PropTypes from 'prop-types';

const cardStyle = makeStyles(theme => ({
  root: {
    paddingBottom: theme.spacing(2)
  },
  cardWrapper: {
    padding: theme.spacing(2, 2),
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
  histogram,
  title,
  type,
  sampleUnitCounts,
  pieChartContent,
  pieChartLegend,
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

    return hardCoralPercentage.toFixed(2);
  };

  const sampleUnitResult = !setToPrivate && (
    <Typography m={1}>Sample units: {sampleUnitCounts} </Typography>
  );

  const subAttributeItem =
    !setToPrivate &&
    (protocolName === 'benthiclit' || protocolName === 'benthicpit' ? (
      <Typography m={1}>Hard coral cover: {findHardCoralValue(protocol.coral_cover)}%</Typography>
    ) : (
      <Typography m={1}>
        Reef fish biomass: {protocolName === 'beltfish' && protocol.biomass_kgha} kg/ha
      </Typography>
    ));

  const subItems = type === 'pieChart' && (
    <Box>
      <Typography m={1}>Data sharing: {dataPolicy}</Typography>
      {sampleUnitResult}
      {subAttributeItem}
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
        pieChartContent={pieChartContent}
        pieChartLegend={pieChartLegend}
        setToPrivate={setToPrivate}
        privateLabel={privateLabel}
        histogram={histogram}
      />
    );

  const cardContent =
    histogram || pieChartContent || textContent ? (
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

  return <div className={classes.root}>{cardContent}</div>;
};

InformationCard.propTypes = {
  dataPolicy: PropTypes.string,
  protocol: PropTypes.object,
  protocolName: PropTypes.string,
  setToPrivate: PropTypes.bool,
  privateLabel: PropTypes.string,
  histogram: PropTypes.array,
  title: PropTypes.string,
  type: PropTypes.string,
  sampleUnitCounts: PropTypes.number,
  pieChartContent: PropTypes.array,
  pieChartLegend: PropTypes.object,
  textContent: PropTypes.object
};

export default InformationCard;
