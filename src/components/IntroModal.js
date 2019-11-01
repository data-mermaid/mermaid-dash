import React, { useState } from 'react';

import makeStyles from '@material-ui/core/styles/makeStyles';
import { ThemeProvider } from 'styled-components/macro';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import MuiDialogContentText from '@material-ui/core/DialogContentText';
import Typography from '@material-ui/core/Typography';
import HelpIcon from '@material-ui/icons/Help';
import Tooltip from '@material-ui/core/Tooltip';
import PropTypes from 'prop-types';
import Fade from '@material-ui/core/Fade';
import styled, { css } from 'styled-components/macro';
import { ButtonStyle } from '../styles/MermaidStyledComponents';
import { theme } from './theme';

const introModalStyleProperties = theme => ({
  mapControlIconProperty: {
    width: '18px',
    height: '18px'
  }
});

const DiablogText = styled('p')`
  font-size: ${props => (props.title === 'title' ? '1.25rem' : '0.85rem')};
  ${props =>
    props.title === 'title' &&
    css`
      margin: 0;
      font-weight: 800;
    `}
`;

const IntroModal = () => {
  const [open, setModalStage] = useState(true);

  const modalCloseHandler = () => {
    setModalStage(!open);
  };

  const summaryStatisticsInfo = (
    <ThemeProvider theme={theme.mapControl}>
      <Tooltip
        title="Zoom to Selected Site"
        placement="right"
        TransitionComponent={Fade}
        TransitionProps={{ timeout: 200 }}
      >
        <ButtonStyle buttonBorder={true} setWiggle={true} onClick={modalCloseHandler}>
          <HelpIcon />
        </ButtonStyle>
      </Tooltip>
    </ThemeProvider>
  );

  return (
    <div>
      {summaryStatisticsInfo}
      <Dialog
        onClose={modalCloseHandler}
        open={open}
        scroll={'paper'}
        PaperProps={{ style: { margin: '8px' } }}
      >
        <MuiDialogTitle>
          <DiablogText title={'title'}>About This Map</DiablogText>
        </MuiDialogTitle>
        <MuiDialogContent>
          <DiablogText>
            Welcome to the MERMAID dashboard. This information represents the time, resources and
            expertise of hundreds of coral reef scientists around the world.
          </DiablogText>
          <DiablogText>
            1. If you would like to publish any analyses based on these data, please contact the
            appropriate project administrators using the [Contact Admins] button (where is just the
            in line button image) available for each site
          </DiablogText>
          <DiablogText>
            2. Do not assume data is representative. Some projects have survey sites in geographies
            to address specific questions (e.g., land-based impacts of reefs, recovery rates from
            cyclone impacts). Summary data may not reflect overall national statistics.
          </DiablogText>
          <DiablogText>Click anywhere to agree to these terms and continue.</DiablogText>
        </MuiDialogContent>
        <MuiDialogActions>
          <Button onClick={modalCloseHandler} color="primary" variant="contained">
            Get Started
          </Button>
        </MuiDialogActions>
      </Dialog>
    </div>
  );
};

export default IntroModal;
