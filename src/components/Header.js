import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import CheckBoxFullMap from './CheckBoxFullMap';

import { ReactComponent as MermaidLogo } from '../styles/Icons/logo.svg';

const useStyles = makeStyles(theme => ({
  appBarProperty: {
    background: '#2C3742',
    height: 49,
    justifyContent: 'center'
  },
  toolBarProperty: {
    padding: 0
  }
}));

const Header = ({ toggle }) => {
  const classes = useStyles();

  return (
    <AppBar position="static" className={classes.appBarProperty}>
      <Toolbar className={classes.toolBarProperty}>
        <Box p={1} flexGrow={1}>
          <MermaidLogo height="38px" />
        </Box>
        <Box p={2}>
          <Typography variant="overline">
            <a
              target="_blank"
              style={{ color: 'white' }}
              href="https://collect.datamermaid.org"
              rel="noopener noreferrer"
            >
              COLLECT
            </a>
          </Typography>
        </Box>
        <Box p={2}>
          <Typography variant="overline">
            <a
              target="_blank"
              style={{ color: 'white' }}
              href="https://datamermaid.org/about/"
              rel="noopener noreferrer"
            >
              ABOUT THIS DATA
            </a>
          </Typography>
        </Box>
        <Box p={2}>
          <Typography variant="overline">
            <a
              target="_blank"
              style={{ color: 'white' }}
              href="https://datamermaid.org/terms-of-service/"
              rel="noopener noreferrer"
            >
              PRIVACY
            </a>
          </Typography>
        </Box>
        <Box p={2}>
          <Typography variant="overline">
            <a
              target="_blank"
              style={{ color: 'white' }}
              href="https://datamermaid.org/contact/"
              rel="noopener noreferrer"
            >
              CONTACT
            </a>
          </Typography>
        </Box>
        <Box>
          <CheckBoxFullMap toggle={toggle} />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
