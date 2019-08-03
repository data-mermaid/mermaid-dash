import React from 'react';

import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import SiteModal from './SiteModal';

import PropTypes from 'prop-types';

const MAX_CHAR = 240;
const tempNote = `Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur unde
suscipit, quam beatae rerum inventore consectetur, neque doloribus, cupiditate numquam
dignissimos laborum fugiat deleniti? Eum quasi quidem quibusdam, consectetur adipisicing elit. Quos blanditiis tenetur unde
suscipit, quam beatae rerum inventore consectetur, neque doloribus, cupiditate numquam
dignissimos laborum fugiat deleniti? Eum quasi quidem quibusdam`;

const ellipsisHelper = note => {
  const newNote = note.length !== 0 ? note : tempNote;
  return newNote.length > MAX_CHAR ? newNote.substr(0, MAX_CHAR) + '...' : newNote;
};

const SiteNote = ({ loadedSiteProperties }) => {
  const { site_notes } = loadedSiteProperties;
  const siteNote = ellipsisHelper(site_notes);

  return (
    <Box>
      <Typography variant="h6">Notes</Typography>
      <Typography variant="body2" display="inline">
        {siteNote}
      </Typography>
      <SiteModal loadedSiteProperties={loadedSiteProperties} />
    </Box>
  );
};

SiteNote.propTypes = {
  loadedSiteProperties: PropTypes.shape({
    site_notes: PropTypes.string
  })
};

export default SiteNote;
