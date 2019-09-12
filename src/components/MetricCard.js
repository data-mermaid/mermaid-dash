import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import PropTypes from 'prop-types';

const cardStyle = makeStyles(theme => ({
  root: {
    padding: theme.spacing(1, 0),
    textAlign: 'center',
    borderRadius: 0
  },
  title: {
    borderTop: '1px solid',
    padding: '12px 4px 4px 4px'
  },
  body: {
    color: '#5080AD',
    padding: theme.spacing(4, 1)
  },
  progress: {
    margin: theme.spacing(4.75, 1)
  }
}));

const MetricCard = ({ content: { title, count }, isLoading }) => {
  const classes = cardStyle();
  const mediaMin1800 = useMediaQuery('(min-width:1800px)');

  const countContent = title === 'Avg Coral Coverage' ? `${count}%` : count;

  const contentItem =
    count !== null && count >= 0 && !isLoading ? (
      <Box className={classes.body}>{countContent}</Box>
    ) : (
      <div>
        <CircularProgress className={classes.progress} />
      </div>
    );
  const titleItem = title ? <Box className={classes.title}>{title}</Box> : null;

  return (
    <Paper className={classes.root}>
      <Typography variant="h2">{contentItem}</Typography>
      {mediaMin1800 ? (
        <Typography variant="h5">{titleItem}</Typography>
      ) : (
        <Typography variant="h6">{titleItem}</Typography>
      )}
    </Paper>
  );
};

MetricCard.propTypes = {
  title: PropTypes.string,
  count: PropTypes.number
};

export default MetricCard;
