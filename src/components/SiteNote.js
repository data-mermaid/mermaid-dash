import PropTypes from 'prop-types'
import React from 'react'

import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import SiteModal from './SiteModal'

const MAX_CHAR = 200

const ellipsisHelper = note => {
  const newNote = note || ''

  return newNote.length > MAX_CHAR ? `${newNote.substr(0, MAX_CHAR)}...` : newNote
}

const SiteNote = ({ currentSelectedSite }) => {
  const { site_notes, project_notes, management_regimes } = currentSelectedSite

  let availableNote = ''
  const management_regime_notes_length =
    management_regimes &&
    management_regimes
      .map(mr => {
        return mr.notes ? mr.notes.length : 0
      })
      .reduce((acc, val) => acc + val, 0)

  const siteNoteLengthCheck = site_notes.length > 0
  const projectNoteLengthCheck = project_notes.length > 0
  const mrNoteLengthCheck = management_regime_notes_length > 0

  const moreThanOneCombinedNote =
    (siteNoteLengthCheck && projectNoteLengthCheck) ||
    (mrNoteLengthCheck && projectNoteLengthCheck) ||
    (siteNoteLengthCheck && mrNoteLengthCheck)

  if (projectNoteLengthCheck) {
    availableNote = project_notes
  } else if (siteNoteLengthCheck) {
    availableNote = site_notes
  } else if (mrNoteLengthCheck) {
    availableNote = management_regimes
      .map(mr => {
        return mr.notes
      })
      .join(', ')
  }

  const readMoreAvailability = availableNote.length > MAX_CHAR || moreThanOneCombinedNote
  const note = ellipsisHelper(availableNote)

  return (
    <Box>
      <Typography variant="h6">Notes</Typography>
      <Typography variant="body2" display="inline">
        {note}
      </Typography>
      <SiteModal
        readMoreAvailability={readMoreAvailability}
        currentSelectedSite={currentSelectedSite}
      />
    </Box>
  )
}

SiteNote.propTypes = {
  currentSelectedSite: PropTypes.shape({
    site_notes: PropTypes.string,
    project_notes: PropTypes.string,
    management_regimes: PropTypes.arrayOf(PropTypes.shape({ notes: PropTypes.string })),
  }),
}.isRequired

export default SiteNote
