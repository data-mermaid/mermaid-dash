import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

const cardStyle = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2, 1)
  }
}));

const card = props => {
  const classes = cardStyle();
  const { title, body, type } = props.content;
  const contentType = type === 'text' ? <Box>{body}</Box> : <Box>CHART</Box>;

  return (
    <Paper className={classes.root}>
      <Typography variant="h4">
        <Box>{title}</Box>
      </Typography>
      <Typography component="div" variant="body1">
        {contentType}
      </Typography>
    </Paper>
  );
};

export default card;
