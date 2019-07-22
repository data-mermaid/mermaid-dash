import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import { TextLoader, ChartLoader } from './Loader';
import BarChart from './BarChart';

import PropTypes from 'prop-types';

const cardStyle = makeStyles(theme => ({
  root: {
    paddingBottom: theme.spacing(2)
  },
  cardProperty: {
    padding: theme.spacing(1, 1)
  }
}));

const Card = ({ content }) => {
  const classes = cardStyle();

  const loaderType = content.type === 'text' ? <TextLoader /> : <ChartLoader />;

  const contentType =
    content.type === 'text' ? (
      <Typography component="div" variant="body1">
        <Box m={1}>{content.body}</Box>
      </Typography>
    ) : (
      <Typography component="div" variant="body1">
        <Box m={1}>
          <BarChart chartContent={content.body} />
        </Box>
      </Typography>
    );

  const contentAvailable = content ? (
    <Paper className={classes.cardProperty}>
      <Typography variant="h4">
        <Box m={1}>{content.title}</Box>
      </Typography>
      {contentType}
    </Paper>
  ) : (
    <Paper className={classes.cardProperty}>{loaderType}</Paper>
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
