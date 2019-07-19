import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import BarChart from './BarChart';

const cardStyle = makeStyles(theme => ({
  root: {
    padding: '0 0 16px 0'
  },
  cardProperty: {
    padding: theme.spacing(1, 1)
  }
}));

const Card = ({ content: { title, body, type } }) => {
  const classes = cardStyle();
  const contentType =
    type === 'text' ? (
      <Typography component="div" variant="body1">
        <Box m={1}>{body}</Box>
      </Typography>
    ) : (
      <Typography component="div" variant="body1">
        <Box m={1}>
          <BarChart chartContent={body} />
        </Box>
      </Typography>
    );

  return (
    <div className={classes.root}>
      <Paper className={classes.cardProperty}>
        <Typography variant="h4">
          <Box m={1}>{title}</Box>
        </Typography>
        {contentType}
      </Paper>
    </div>
  );
};

export default Card;
