import React, { useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import MuiDialogContentText from '@material-ui/core/DialogContentText';
import Typography from '@material-ui/core/Typography';

import PropTypes from 'prop-types';

const modalStyles = makeStyles(theme => ({
  modalContainer: {
    display: 'inline',
    marginLeft: 5
  },
  noteContentProperty: {
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

const Note = ({ children, content }) => {
  const classes = modalStyles();
  const contentLengthCheck = content.length > 0;

  const noteTitle = contentLengthCheck && <Typography variant="h6">{children}</Typography>;
  const noteBody = contentLengthCheck && (
    <MuiDialogContentText className={classes.noteContentProperty}>{content}</MuiDialogContentText>
  );

  return (
    <>
      {noteTitle}
      {noteBody}
    </>
  );
};

const ManagementRegimeNote = ({ children, content }) => {
  const classes = modalStyles();
  const management_regime_notes_length =
    content &&
    content
      .map(mr => {
        return mr.notes ? mr.notes.length : 0;
      })
      .reduce((acc, val) => acc + val, 0);
  const mrNoteLengthCheck = management_regime_notes_length > 0;
  const noteTitle = mrNoteLengthCheck && <Typography variant="h6">{children}</Typography>;
  const noteBody =
    mrNoteLengthCheck &&
    content.map(mr => {
      return (
        <div key={mr.id} className={classes.noteContentProperty}>
          <Typography variant="h6">
            {'- '}
            {mr.name}
          </Typography>
          <MuiDialogContentText>{mr.notes}</MuiDialogContentText>
        </div>
      );
    });

  return (
    <>
      {noteTitle}
      {noteBody}
    </>
  );
};

const ReadMore = ({ modalCloseHandler, readMoreAvailability }) => {
  const classes = modalStyles();

  const readMoreContent = readMoreAvailability && (
    <Typography
      variant="body2"
      display="inline"
      className={classes.readMoreProperty}
      onClick={modalCloseHandler}
    >
      read more
    </Typography>
  );

  return <>{readMoreContent}</>;
};

const SiteModal = ({ loadedSiteProperties, readMoreAvailability }) => {
  const classes = modalStyles();
  const { site_notes, project_notes, management_regimes } = loadedSiteProperties;
  const [open, setModalStage] = useState(false);

  const modalCloseHandler = () => {
    setModalStage(open === false ? true : false);
  };

  return (
    <div className={classes.modalContainer}>
      <ReadMore modalCloseHandler={modalCloseHandler} readMoreAvailability={readMoreAvailability} />
      <Dialog onClose={modalCloseHandler} aria-labelledby="customized-dialog-title" open={open}>
        <MuiDialogTitle disableTypography>
          <Typography variant="h5">Notes</Typography>
        </MuiDialogTitle>
        <MuiDialogContent dividers>
          <Note content={project_notes}>{'Project Notes'}</Note>
          <Note content={site_notes}>{'Site Notes'}</Note>
          <ManagementRegimeNote content={management_regimes}>
            {'Management Regime Notes'}
          </ManagementRegimeNote>
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
    project_notes: PropTypes.string,
    management_regimes: PropTypes.array
  }),
  readMoreAvailability: PropTypes.bool
};

export default SiteModal;
