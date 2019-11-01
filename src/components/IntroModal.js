import React, { useState } from 'react';

import { ThemeProvider } from 'styled-components/macro';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import HelpIcon from '@material-ui/icons/Help';
import Tooltip from '@material-ui/core/Tooltip';
import Fade from '@material-ui/core/Fade';

import { theme } from './theme';
import { ButtonStyle, DialogText } from '../styles/MermaidStyledComponents';

const IntroModal = () => {
  const [open, setModalStage] = useState(true);

  const modalToggleHandler = () => {
    setModalStage(!open);
  };

  const summaryStatisticsInfo = (
    <ThemeProvider theme={theme.mapControl}>
      <Tooltip
        title="About This Map"
        placement="right"
        TransitionComponent={Fade}
        TransitionProps={{ timeout: 200 }}
      >
        <ButtonStyle buttonBorder={true} setWiggle={true} onClick={modalToggleHandler}>
          <HelpIcon />
        </ButtonStyle>
      </Tooltip>
    </ThemeProvider>
  );

  return (
    <div>
      {summaryStatisticsInfo}
      <Dialog
        onClose={modalToggleHandler}
        open={open}
        scroll={'paper'}
        PaperProps={{ style: { margin: '8px' } }}
      >
        <MuiDialogTitle>
          <DialogText dialogTitle={true}>About This Map</DialogText>
        </MuiDialogTitle>
        <MuiDialogContent>
          <DialogText>
            Welcome to the MERMAID dashboard. This information represents the time, resources and
            expertise of hundreds of coral reef scientists around the world.
          </DialogText>
          <DialogText>
            1. If you would like to publish any analyses based on these data, please contact the
            appropriate project administrators using the [Contact Admins] button (where is just the
            in line button image) available for each site
          </DialogText>
          <DialogText>
            2. Do not assume data is representative. Some projects have survey sites in geographies
            to address specific questions (e.g., land-based impacts of reefs, recovery rates from
            cyclone impacts). Summary data may not reflect overall national statistics.
          </DialogText>
          <DialogText>Click anywhere to agree to these terms and continue.</DialogText>
        </MuiDialogContent>
        <MuiDialogActions>
          <Button onClick={modalToggleHandler} color="primary">
            Get Started
          </Button>
        </MuiDialogActions>
      </Dialog>
    </div>
  );
};

export default IntroModal;
