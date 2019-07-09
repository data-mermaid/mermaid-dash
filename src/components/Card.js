import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

const cardStyle = makeStyles(theme => ({
  root: {
    padding: theme.spacing(1, 1)
  }
}));

const Card = ({ content: { title, body, type } } = {}) => {
  const { root: paperClasses } = cardStyle();
  const contentType =
    type === 'text' ? (
      <Typography component="div" variant="body1">
        <Box m={1}>{body}</Box>
      </Typography>
    ) : (
      <Typography component="div" variant="body1">
        <Box m={1}>CHART</Box>
      </Typography>
    );

  return (
    <Paper className={paperClasses}>
      <Typography variant="h4">
        <Box m={1}>{title}</Box>
      </Typography>
      {contentType}
    </Paper>
  );
};

export default Card;
