import React from 'react';

import DownloadIcon from '@material-ui/icons/CloudDownload';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

import { makeStyles } from '@material-ui/core/styles';
import { ThemeProvider } from 'styled-components/macro';
import { theme } from '../constants/theme';
import { ButtonStyle } from '../styles/MermaidStyledComponents';

const downloadButtonStyle = makeStyles(theme => ({
  iconProperty: {
    paddingRight: '5px'
  }
}));

const DownloadButton = setToPrivate => {
  const classes = downloadButtonStyle();
  return (
    <ThemeProvider theme={theme.cardButton}>
      <ButtonStyle notAllowed={setToPrivate} boxShadow={true}>
        <Box p={1} display="flex" justifyContent="center">
          <DownloadIcon fontSize="small" className={classes.iconProperty} />
          <Typography variant="body1" display="inline">
            Download Data
          </Typography>
        </Box>
      </ButtonStyle>
    </ThemeProvider>
  );
};

export default DownloadButton;
