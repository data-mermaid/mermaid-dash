import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import CheckBoxFullMap from './CheckBoxFullMap';

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
          <Typography variant="h4">MERMAID</Typography>
        </Box>
        <Box p={2}>
          <Typography variant="overline">COLLECT</Typography>
        </Box>
        <Box p={2}>
          <Typography variant="overline">ABOUT THIS DATA</Typography>
        </Box>
        <Box p={2}>
          <Typography variant="overline">PRIVACY</Typography>
        </Box>
        <Box p={2}>
          <Typography variant="overline">CONTACT</Typography>
        </Box>
        <Box>
          <CheckBoxFullMap toggle={toggle} />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
