import React, { useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';

import PropTypes from 'prop-types';

const tempProjectNote = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas finibus mattis orci, molestie suscipit nunc tempus in. Cras pharetra est quis lobortis egestas. Etiam ut risus ut diam vulputate elementum ac in massa. Proin imperdiet nulla nibh, sit amet suscipit tellus tempor ut. Quisque eget ex bibendum, elementum velit a, consectetur felis. Donec ac tincidunt libero. Praesent sed accumsan est. Nam dictum elit vel porta aliquam. Phasellus erat ligula, aliquet ut ante condimentum, pulvinar pellentesque erat. Donec vehicula, metus scelerisque maximus efficitur, sem lorem elementum dui, quis ullamcorper nunc quam quis sem. Suspendisse consectetur, libero sed facilisis dictum, mauris felis hendrerit nulla, feugiat sodales massa libero quis enim.`;

const tempSiteNote = `Aliquam erat volutpat. Donec placerat nisl magna, et faucibus arcu condimentum sed. Nisl magna, et faucibus arcu condimentum sed. Aliquam erat volutpat. Donec placerat nisl magna.`;

const modalStyles = makeStyles(theme => ({
  modalContainer: {
    display: 'inline',
    marginLeft: 5
  },
  titleProperty: {
    margin: 0,
    padding: theme.spacing(1)
  },
  readMoreProperty: {
    cursor: 'pointer',
    color: '#2614AF',
    textDecoration: 'underline'
  },
  emptyNoteProperty: {
    fontStyle: 'italic'
  }
}));

const NoteBody = ({ children }) => {
  const classes = modalStyles();
  return (
    <Typography gutterBottom className={classes.titleProperty}>
      {children.length > 0 ? (
        children
      ) : (
        <span className={classes.emptyNoteProperty}>No notes available</span>
      )}
    </Typography>
  );
};

const SiteModal = ({ loadedSiteProperties }) => {
  const classes = modalStyles();
  const { site_notes, project_notes } = loadedSiteProperties;
  const [open, setModalStage] = useState(false);

  const modalCloseHandler = () => {
    setModalStage(open === false ? true : false);
  };

  return (
    <div className={classes.modalContainer}>
      <Typography
        variant="body2"
        display="inline"
        className={classes.readMoreProperty}
        onClick={modalCloseHandler}
      >
        read more
      </Typography>
      <Dialog onClose={modalCloseHandler} aria-labelledby="customized-dialog-title" open={open}>
        <MuiDialogTitle disableTypography>
          <Typography variant="h5">Notes</Typography>
        </MuiDialogTitle>
        <MuiDialogContent dividers>
          <Typography variant="h6">Project Notes</Typography>
          <NoteBody>{project_notes.length > 0 ? project_notes : tempProjectNote}</NoteBody>
          <Typography variant="h6">Site Notes</Typography>
          <NoteBody>{site_notes.length > 0 ? site_notes : tempSiteNote}</NoteBody>
          <Typography variant="h6">Management Regime Notes</Typography>
          <NoteBody>{''}</NoteBody>
        </MuiDialogContent>
        <MuiDialogActions>
          <Button onClick={modalCloseHandler} color="primary">
            close
          </Button>
        </MuiDialogActions>
      </Dialog>
    </div>
  );
};

SiteModal.propTypes = {
  loadedSiteProperties: PropTypes.shape({
    site_notes: PropTypes.string,
    project_notes: PropTypes.string
  })
};

export default SiteModal;
