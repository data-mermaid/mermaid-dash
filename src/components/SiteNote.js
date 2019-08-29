import React from 'react';

import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import SiteModal from './SiteModal';

import PropTypes from 'prop-types';

const MAX_CHAR = 200;
const tempNote = `No notes available`;

const ellipsisHelper = note => {
  const newNote = note.length !== 0 ? note : tempNote;
  return newNote.length > MAX_CHAR ? newNote.substr(0, MAX_CHAR) + '...' : newNote;
};

const SiteNote = ({ loadedSiteProperties }) => {
  const { site_notes, project_notes } = loadedSiteProperties;
  const moreThanOneCombinedNote = site_notes.length > 0 && project_notes.length > 0;
  const availableNote =
    project_notes.length > 0 ? project_notes : site_notes.length > 0 ? site_notes : tempNote;
  const readMoreAvailability =
    availableNote === tempNote || availableNote.length > MAX_CHAR || moreThanOneCombinedNote;
  const note = ellipsisHelper(availableNote);

  return (
    <Box>
      <Typography variant="h6">Notes</Typography>
      <Typography variant="body2" display="inline">
        {note}
      </Typography>
      <SiteModal
        readMoreAvailability={readMoreAvailability}
        loadedSiteProperties={loadedSiteProperties}
      />
    </Box>
  );
};

SiteNote.propTypes = {
  loadedSiteProperties: PropTypes.shape({
    site_notes: PropTypes.string
  })
};

export default SiteNote;
