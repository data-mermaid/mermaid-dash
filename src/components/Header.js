import React from 'react';

import { ReactComponent as MermaidLogo } from '../styles/Icons/logo.svg';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import makeStyles from '@material-ui/core/styles/makeStyles';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { drawerWidth } from '../constants/summary-information';

import PropTypes from 'prop-types';

const headerStyles = makeStyles(theme => ({
  appBarProperty: {
    background: '#2C3742',
    height: 49,
    justifyContent: 'center',
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginRight: drawerWidth
  },
  toolBarProperty: {
    padding: 0
  },
  menuIconProperty: {
    margin: 0
  },
  hide: {
    display: 'none'
  }
}));

const Header = ({ handleDrawerChange }) => {
  const classes = headerStyles();

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
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerChange}
            className={classes.menuIconProperty}
          >
            <MenuIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

Header.propTypes = {
  handleDrawerChange: PropTypes.func,
  classes: PropTypes.object
};

export default Header;
