import React from 'react';

import DownloadIcon from '@material-ui/icons/CloudDownload';
import { ThemeProvider } from 'styled-components/macro';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import { TextLoader, ChartLoader } from './Loader';
import { theme } from './theme';
import { ButtonStyle } from './Button';
import Chart from './Chart';

import PropTypes from 'prop-types';

const cardStyle = makeStyles(theme => ({
  root: {
    paddingBottom: theme.spacing(2)
  },
  cardWrapper: {
    padding: theme.spacing(2, 2)
  },
  iconProperty: {
    paddingRight: '5px'
  }
}));

const Card = ({ content }) => {
  const classes = cardStyle();

  const loaderType = content.type === 'text' ? <TextLoader /> : <ChartLoader />;

  const subAttributeItem = content.hardCoralCovers ? (
    <Typography m={1}>Hard coral cover: {content.hardCoralCovers} %</Typography>
  ) : (
    <Typography m={1}>Reef fish biomass: {content.reefFishBiomass} kg/ha</Typography>
  );

  const subItems = content.type === 'pieChart' && (
    <Box>
      <Typography m={1}>Data sharing: {content.dataPolicy}</Typography>
      <Typography m={1}>Sample units: {content.sampleUnits} </Typography>
      {subAttributeItem}
    </Box>
  );

  const subTitle = content.subTitle && <Typography variant="h6">{content.subTitle}</Typography>;

  const downLoadButton = content.type === 'pieChart' && (
    <ThemeProvider theme={theme.cardButton}>
      <ButtonStyle setHover={true}>
        <Box p={1} display="flex" justifyContent="center">
          <DownloadIcon fontSize="small" className={classes.iconProperty} />
          <Typography variant="body1" display="inline">
            Download Data
          </Typography>
        </Box>
      </ButtonStyle>
    </ThemeProvider>
  );

  const contentType =
    content.type === 'text' ? (
      <Box pt={1}>
        {subTitle}
        <Typography variant="body1">{content.body}</Typography>
      </Box>
    ) : (
      <Box pt={1}>
        <Chart chartType={content.type} chartContent={content.body} chartLegend={content.legend} />
      </Box>
    );

  const contentAvailable = content ? (
    <Paper className={classes.cardWrapper}>
      <Box display="flex" borderBottom={1}>
        <Box flexGrow={1}>
          <Box>
            <Typography variant="h4">{content.title}</Typography>
          </Box>
          {subItems}
        </Box>
        <Box>{downLoadButton}</Box>
      </Box>
      {contentType}
    </Paper>
  ) : (
    <Paper className={classes.cardWrapper}>{loaderType}</Paper>
  );

  return <div className={classes.root}>{contentAvailable}</div>;
};

Card.propTypes = {
  content: PropTypes.shape({
    title: PropTypes.string,
    // body: PropTypes.array || PropTypes.string, //there are 2 data types for content body now
    type: PropTypes.string
  })
};

export default Card;
