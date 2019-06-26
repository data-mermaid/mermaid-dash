import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import SiteList from './SiteList';

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  containerBox: {
    margin: '10px 0 0 0'
  }
});

class DashBoard extends Component {
  render() {
    const { classes } = this.props;

    const dashboard = this.props.showFullMap ? (
      <Grid container className={classes.containerBox}>
        <Grid item sm={6} />
        <Grid item sm={5}>
          <SiteList />
        </Grid>
      </Grid>
    ) : null;
    return <div>{dashboard}</div>;
  }
}

export default withStyles(styles)(DashBoard);
