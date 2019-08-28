import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
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
    padding: theme.spacing(1, 1)
  },
  body: {
    color: '#5080AD',
    padding: theme.spacing(4, 1)
  },
  progress: {
    margin: theme.spacing(4.75, 1)
  }
}));

const MetricCard = ({ content: { title, count, isLoading } }) => {
  const classes = cardStyle();

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
      <Typography variant="subtitle1" component="div">
        {titleItem}
      </Typography>
    </Paper>
  );
};

MetricCard.propTypes = {
  title: PropTypes.string,
  count: PropTypes.number
};

export default MetricCard;
