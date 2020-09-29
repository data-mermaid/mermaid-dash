import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import { DialogText } from '../styles/MermaidStyledComponents';

const modalStyles = makeStyles(theme => ({
  familyRecordInfoStyle: {
    cursor: 'pointer',
    color: '#2614AF'
  }
}));
const FishFamilyModal = ({ open, modalToggleHandler, projectFishFamilies }) => {
  const classes = modalStyles();
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
      <Typography
        variant="body2"
        display="inline"
        className={classes.familyRecordInfoStyle}
        onClick={modalToggleHandler}
      >
        Click to view number of families recorded
      </Typography>
      <Dialog
        onClose={modalToggleHandler}
        open={open}
        scroll={'paper'}
        PaperProps={{ style: { margin: '8px', minWidth: '300px' } }}
      >
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
      </Dialog>
    </>
  );
};

export default FishFamilyModal;
