import React from 'react';

import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

const CardTextContent = ({ textContent }) => {
  return (
    <Box pt={1}>
      <Typography variant="h6">{textContent.header}</Typography>
      <Typography variant="body1">{textContent.body}</Typography>
    </Box>
  );
};

export default CardTextContent;
