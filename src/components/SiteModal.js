import React, { useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';

import PropTypes from 'prop-types';

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

const Note = ({ children, content }) => {
  const classes = modalStyles();

  const noteTitle = content.length > 0 && <Typography variant="h6">{children}</Typography>;

  const noteBody = content.length > 0 && (
    <Typography gutterBottom className={classes.titleProperty}>
      {content}
    </Typography>
  );

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
  const { site_notes, project_notes } = loadedSiteProperties;
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
