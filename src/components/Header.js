import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import ToggleMap from './ToggleMap';

const useStyles = makeStyles(theme => ({
  menuItem: {
    textAlign: 'center'
  },
  color: {
    background: '#2C3742'
  }
}));

const HeaderMui = props => {
  const classes = useStyles();

  return (
    <AppBar position="static" className={classes.color}>
      <Toolbar>
        <Grid container>
          <Grid item xs={7}>
            <Typography variant="h4">MERMAID</Typography>
          </Grid>
          <Grid container justify="flex-end" alignItems="flex-start" item xs={5}>
            <Grid item xs={2} className={classes.menuItem}>
              <Typography variant="overline">COLLECT</Typography>
            </Grid>
            <Grid item xs={3} className={classes.menuItem}>
              <Typography variant="overline">ABOUT THESE DATA</Typography>
            </Grid>
            <Grid item xs={2} className={classes.menuItem}>
              <Typography variant="overline">PRIVACY</Typography>
            </Grid>
            <Grid item xs={2} className={classes.menuItem}>
              <Typography variant="overline">CONTACT</Typography>
            </Grid>
            <Grid item xs={3} className={classes.menuItem}>
              <ToggleMap toggle={props.toggle}>Show Full Map</ToggleMap>
            </Grid>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default HeaderMui;
