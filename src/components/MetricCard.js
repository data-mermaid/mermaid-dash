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
    padding: '30px 0px 30px 0'
  },
  progress: {
    margin: '35px'
  }
}));

const MetricCard = ({ content: { title, count }, isLoading }) => {
  const classes = cardStyle();
  const mediaMin1842 = useMediaQuery('(min-width:1842px)');
  const mediaMin1600 = useMediaQuery('(min-width:1600px)');

  const countContent = title === 'Avg Coral Coverage' ? `${count}%` : count;
  if (title === 'Avg Coral Coverage' && !mediaMin1600) {
    title = 'Avg CC';
  }

  const contentItem =
    count !== null && count >= 0 && !isLoading ? (
      <Box className={classes.body}>{countContent}</Box>
    ) : (
      <CircularProgress size={50} className={classes.progress} />
    );

  const titleItem = title ? <Box className={classes.title}>{title}</Box> : null;

  return (
    <Paper className={classes.root}>
      <Typography variant="h2">{contentItem}</Typography>
      <Box fontWeight="fontWeightMedium" fontSize={mediaMin1842 ? 18 : 15}>
        {titleItem}
      </Box>
    </Paper>
  );
};

MetricCard.propTypes = {
  title: PropTypes.string,
  count: PropTypes.number
};

export default MetricCard;
