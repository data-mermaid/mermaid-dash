import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Box from '@material-ui/core/Box';
import CheckBoxFullMap from './CheckBoxFullMap';
import { LinkStyle } from '../styles/MermaidStyledComponents';

import { ReactComponent as MermaidLogo } from '../styles/Icons/logo.svg';

const MermaidHeader = [
  { name: 'COLLECT', link: 'https://collect.datamermaid.org' },
  { name: 'ABOUT THIS DATA', link: 'https://datamermaid.org/about/' },
  { name: 'PRIVACY', link: 'https://datamermaid.org/terms-of-service/' },
  { name: 'CONTACT', link: 'https://datamermaid.org/contact/' }
];

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

const HeaderItem = ({ children, link }) => {
  return (
    <Box p={2} fontSize={12} fontWeight="fontWeightBold">
      <LinkStyle target="_blank" href={link} rel="noopener noreferrer">
        {children}
      </LinkStyle>
    </Box>
  );
};

const HeaderItems = MermaidHeader.map(({ name, link }) => {
  return (
    <HeaderItem key={name} link={link}>
      {name}
    </HeaderItem>
  );
});

const Header = ({ toggle }) => {
  const classes = useStyles();

  return (
    <AppBar position="static" className={classes.appBarProperty}>
      <Toolbar className={classes.toolBarProperty}>
        <Box p={1} flexGrow={1}>
          <MermaidLogo height="38px" />
        </Box>
        {HeaderItems}
        <Box>
          <CheckBoxFullMap toggle={toggle} />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
