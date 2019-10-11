import React from 'react';

import PropTypes from 'prop-types';
import makeStyles from '@material-ui/core/styles/makeStyles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Box from '@material-ui/core/Box';

import { ReactComponent as MermaidLogo } from '../styles/Icons/logo.svg';
import { MenuLink } from '../styles/MermaidStyledComponents';
import HeaderMenu from './HeaderMenu';
import { mermaidHeader } from '../constants/header';

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

const HeaderItem = ({ children, link }) => {
  return (
    <Box p={2} fontSize={12} fontWeight="fontWeightBold">
      <MenuLink target="_blank" href={link} rel="noopener noreferrer">
        {children}
      </MenuLink>
    </Box>
  );
};

const HeaderItems = mermaidHeader.map(({ name, link }) => {
  return (
    <HeaderItem key={name} link={link}>
      {name}
    </HeaderItem>
  );
});

const Header = () => {
  const classes = headerStyles();
  const mediaMax960 = useMediaQuery('(min-width:960px');

  return (
    <AppBar position="static" className={classes.appBarProperty}>
      <Toolbar className={classes.toolBarProperty}>
        <Box p={1} flexGrow={1}>
          <MermaidLogo height="38px" />
        </Box>
        {mediaMax960 && HeaderItems}
        <HeaderMenu />
      </Toolbar>
    </AppBar>
  );
};

Header.propTypes = {
  handleDrawerChange: PropTypes.func,
  classes: PropTypes.object
};

export default Header;
