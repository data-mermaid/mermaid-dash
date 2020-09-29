import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';

import { DialogText } from '../styles/MermaidStyledComponents';
import ModalContent from './ModalContent';

const modalStyles = makeStyles(theme => ({
  familyRecordInfoStyle: {
    cursor: 'pointer',
    color: '#2614AF'
  }
}));

const FishFamilyModal = ({ open, modalToggleHandler, projectFishFamilies }) => {
  const classes = modalStyles();

  const clickToViewModal = (
    <Typography
      display="inline"
      className={classes.familyRecordInfoStyle}
      onClick={modalToggleHandler}
    >
      [View]
    </Typography>
  );

  const fishFamiliesContent = projectFishFamilies.map(family => {
    return <li key={family}>{family}</li>;
  });

  return (
    <>
      {clickToViewModal}
      <ModalContent open={open} modalToggleHandler={modalToggleHandler}>
        <MuiDialogTitle>
          <DialogText dialogTitle={true}>Fish Families Surveyed</DialogText>
        </MuiDialogTitle>
        <MuiDialogContent dividers>
          <DialogText subtext>
            This project's biomass reflects only fish from a restricted set of families; by design,
            not all fish were recorded by this project's surveyors. Biomass should be compared to
            that of other projects with care.
          </DialogText>
          <ul>{fishFamiliesContent}</ul>
        </MuiDialogContent>
        <MuiDialogActions>
          <Button onClick={modalToggleHandler} color="primary">
            close
          </Button>
        </MuiDialogActions>
      </ModalContent>
    </>
  );
};

export default FishFamilyModal;
