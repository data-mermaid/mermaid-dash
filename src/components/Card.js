import React from 'react';

// import DownloadIcon from '@material-ui/icons/CloudDownload';
// import { ThemeProvider } from 'styled-components/macro';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import { TextLoader, ChartLoader } from './Loader';
// import { theme } from './theme';
// import { ButtonStyle } from './Button';
import CardChartContent from './CardChartContent';
import CartTextContent from './CardTextContent';

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

const Card = ({
  dataPolicy,
  protocol,
  protocolName,
  privatePolicy,
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

  const sampleUnitResult = !privatePolicy && (
    <Typography m={1}>Sample units: {sampleUnitCounts} </Typography>
  );

  const subAttributeItem =
    !privatePolicy &&
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
  //   <ThemeProvider theme={theme.cardButton}>
  //     <ButtonStyle notAllowed={privatePolicy} boxShadow={true}>
  //       <Box p={1} display="flex" justifyContent="center">
  //         <DownloadIcon fontSize="small" className={classes.iconProperty} />
  //         <Typography variant="body1" display="inline">
  //           Download Data
  //         </Typography>
  //       </Box>
  //     </ButtonStyle>
  //   </ThemeProvider>
  // );
  const contentItem =
    type === 'text' ? (
      <CartTextContent textContent={textContent} />
    ) : (
      <CardChartContent
        chartType={type}
        pieChartContent={pieChartContent}
        pieChartLegend={pieChartLegend}
        privatePolicy={privatePolicy}
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
          {/* <Box>{downLoadButton}</Box> */}
        </Box>
        {contentItem}
      </Paper>
    ) : (
      <Paper className={classes.cardWrapper}>{loaderType}</Paper>
    );

  return <div className={classes.root}>{cardContent}</div>;
};

Card.propTypes = {
  dataPolicy: PropTypes.string,
  protocol: PropTypes.object,
  protocolName: PropTypes.string,
  privatePolicy: PropTypes.bool,
  privateLabel: PropTypes.string,
  histogram: PropTypes.array,
  title: PropTypes.string,
  type: PropTypes.string,
  sampleUnitCounts: PropTypes.number,
  pieChartContent: PropTypes.array,
  pieChartLegend: PropTypes.object,
  textContent: PropTypes.object
};

export default Card;
