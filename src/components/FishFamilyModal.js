import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

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

  const clickToViewModal =
    projectFishFamilies.length > 0 ? (
      <Typography className={classes.familyRecordInfoStyle} onClick={modalToggleHandler}>
        Click to view number of families recorded
      </Typography>
    ) : (
      <Typography>No fish families recorded</Typography>
    );

  const fishFamiliesContent = projectFishFamilies.map(family => {
    return (
      <ListItem key={family}>
        <ListItemText>
          {'- '}
          {family}
        </ListItemText>
      </ListItem>
    );
  });

  return (
    <>
      {clickToViewModal}
      <ModalContent open={open} modalToggleHandler={modalToggleHandler}>
        <MuiDialogTitle>
          <DialogText dialogTitle={true}>Fish Families</DialogText>
        </MuiDialogTitle>
        <MuiDialogContent dividers>
          <List>{fishFamiliesContent}</List>
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
