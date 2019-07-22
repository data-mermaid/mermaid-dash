import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import CheckBoxFullMap from './CheckBoxFullMap';

const useStyles = makeStyles(theme => ({
  menuProperty: {
    width: '100vw'
  },
  appBarProperty: {
    background: '#2C3742'
  },
  checkBoxProperty: {
    paddingTop: theme.spacing(1)
  }
}));

const Header = ({ toggle }) => {
  const classes = useStyles();

  return (
    <AppBar position="static" className={classes.appBarProperty}>
      <Toolbar>
        <div className={classes.menuProperty}>
          <Box display="flex">
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
            <Box className={classes.checkBoxProperty}>
              <CheckBoxFullMap toggle={toggle} />
            </Box>
          </Box>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
