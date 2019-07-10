import React, { Component } from 'react';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import SiteList from './SiteList';
import MetricCards from './MetricCards';
import Card from './Card';
import Samples from '../sample_data/Samples';

import PropTypes from 'prop-types';

const gridStyleProperties = theme => ({
  root: {
    padding: theme.spacing(2, 2),
    height: 'calc(100vh - 64px)',
    overflow: 'overlay'
  },
  dashBoardProperty: {
    position: 'relative'
  }
});

class DashBoard extends Component {
  render() {
    const { classes, showFullMap } = this.props;

    const dashboard = showFullMap ? (
      <Grid container className={classes.root}>
        <Grid item sm={7} />
        <Grid item sm={5} className={classes.dashBoardProperty}>
          <Card content={Samples.summary} />
          <MetricCards />
          <SiteList />
          <Card content={Samples.chartData} />
        </Grid>
      </Grid>
    ) : null;
    return <div>{dashboard}</div>;
  }
}

DashBoard.propTypes = {
  showFullMap: PropTypes.bool,
  classes: PropTypes.object
};

export default withStyles(gridStyleProperties)(DashBoard);
