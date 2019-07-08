import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

const cardStyle = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3, 2)
  }
}));

const card = props => {
  const { root: paperClasses } = cardStyle();
  const { title, body, type } = props.content;
  const contentType =
    type === 'text' ? (
      <Typography component="div" variant="body1">
        <Box>{body}</Box>
      </Typography>
    ) : (
      <Typography component="div" variant="body1">
        <Box>CHART</Box>
      </Typography>
    );

  return (
    <Paper className={paperClasses}>
      <Typography variant="h4">
        <Box>{title}</Box>
      </Typography>
      {contentType}
    </Paper>
  );
};

export default card;
