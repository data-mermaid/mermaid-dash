import React from 'react';

import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import SiteModal from './SiteModal';

const MAX_CHAR = 240;
const tempNote = `Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur unde
suscipit, quam beatae rerum inventore consectetur, neque doloribus, cupiditate numquam
dignissimos laborum fugiat deleniti? Eum quasi quidem quibusdam, consectetur adipisicing elit. Quos blanditiis tenetur unde
suscipit, quam beatae rerum inventore consectetur, neque doloribus, cupiditate numquam
dignissimos laborum fugiat deleniti? Eum quasi quidem quibusdam`;

const ellipsisHelper = note => {
  return note.length > MAX_CHAR ? note.substr(0, MAX_CHAR) + '...' : note;
};

const SiteNote = ({ loadedSiteProperties = tempNote }) => {
  // const { site_notes } = loadedSiteProperties;
  console.log(loadedSiteProperties);
  // const { site_notes = tempNote } = loadedSiteProperties;
  const siteNote = ellipsisHelper(loadedSiteProperties);

  return (
    <Box>
      <Typography variant="h6">Notes</Typography>
      <Typography variant="body2" display="inline">
        {siteNote}
      </Typography>
      {/* <SiteModal loadedSiteProperties={loadedSiteProperties}/> */}
    </Box>
  );
};

export default SiteNote;
