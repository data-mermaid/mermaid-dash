import React, { useState } from 'react';

import makeStyles from '@material-ui/core/styles/makeStyles';

import Button from '@material-ui/core/Button';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';

import PropTypes from 'prop-types';
import { DialogText } from '../styles/MermaidStyledComponents';
import ModalContent from './ModalContent';

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
  }
}));

const Note = ({ children, content }) => {
  const classes = modalStyles();
  const contentLengthCheck = content.length > 0;

  const noteTitle = contentLengthCheck && <DialogText dialogHeader={true}>{children}</DialogText>;
  const noteBody = contentLengthCheck && (
    <DialogText className={classes.noteContentProperty}>{content}</DialogText>
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
  const noteTitle = mrNoteLengthCheck && <DialogText dialogHeader={true}>{children}</DialogText>;
  const noteBody =
    mrNoteLengthCheck &&
    content.map(mr => {
      return (
        <div key={mr.id} className={classes.noteContentProperty}>
          <DialogText mrTitleItem={true}>
            {'- '}
            {mr.name}
          </DialogText>
          <DialogText>{mr.notes}</DialogText>
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

const ReadMore = ({ modalToggleHandler, readMoreAvailability }) => {
  const classes = modalStyles();

  const readMoreContent = readMoreAvailability && (
    <Typography
      variant="body2"
      display="inline"
      className={classes.readMoreProperty}
      onClick={modalToggleHandler}
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

  const modalToggleHandler = () => {
    setModalStage(!open);
  };

  const clickToViewModal = (
    <ReadMore modalToggleHandler={modalToggleHandler} readMoreAvailability={readMoreAvailability} />
  );

  return (
    <div className={classes.modalContainer}>
      {clickToViewModal}
      <ModalContent open={open} modalToggleHandler={modalToggleHandler}>
        <MuiDialogTitle>
          <DialogText dialogTitle={true}>Notes</DialogText>
        </MuiDialogTitle>
        <MuiDialogContent dividers>
          <Note content={project_notes}>{'Project Notes'}</Note>
          <Note content={site_notes}>{'Site Notes'}</Note>
          <ManagementRegimeNote content={management_regimes}>
            {'Management Regime Notes'}
          </ManagementRegimeNote>
        </MuiDialogContent>
        <MuiDialogActions>
          <Button onClick={modalToggleHandler} color="primary">
            close
          </Button>
        </MuiDialogActions>
      </ModalContent>
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
