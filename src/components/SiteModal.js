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

  const noteTitle = content && <DialogText dialogHeader={true}>{children}</DialogText>;
  const noteBody = content && (
    <DialogText className={classes.noteContentProperty}>{content}</DialogText>
  );

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

const SiteModal = ({ currentSelectedSite, readMoreAvailability }) => {
  const classes = modalStyles();
  const { site_notes, management_notes, project_notes } = currentSelectedSite;
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
          <Note content={management_notes}>{'Management Regime Notes'}</Note>
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
  currentSelectedSite: PropTypes.shape({
    site_notes: PropTypes.string,
    project_notes: PropTypes.string,
    management_notes: PropTypes.string
  }),
  readMoreAvailability: PropTypes.bool
};

export default SiteModal;
