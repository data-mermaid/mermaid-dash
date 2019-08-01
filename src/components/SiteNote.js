import React from 'react';

import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

const MAX_CHAR = 240;

const ellipsisHelper = note => {
  return note.length > MAX_CHAR ? note.substr(0, MAX_CHAR) + '...' : note;
};

const SiteNote = ({ loadedSiteNote }) => {
  const tempNote = `Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur unde
  suscipit, quam beatae rerum inventore consectetur, neque doloribus, cupiditate numquam
  dignissimos laborum fugiat deleniti? Eum quasi quidem quibusdam.`;

  const siteNote = loadedSiteNote ? ellipsisHelper(loadedSiteNote) : ellipsisHelper(tempNote);

  return (
    <Box>
      <Typography variant="h6">Notes</Typography>
      <Typography variant="body2">{siteNote} read more</Typography>
    </Box>
  );
};

export default SiteNote;
