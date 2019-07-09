import React, { Component } from 'react';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import SiteList from './SiteList';
import MetricCards from './MetricCards';
import Card from './Card';

import PropTypes from 'prop-types';

const gridStyleProperties = theme => ({
  root: {
    padding: theme.spacing(2, 2),
    height: '100vh',
    overflow: 'overlay'
  },
  dashBoardProperty: {
    position: 'relative'
  }
});

class DashBoard extends Component {
  state = {
    content: {
      title: 'Summary Statistics',
      body:
        'Mermaid believes in coral reef conservation through collaboration. We use cutting edge technology to visualize, analyse and share data about coral reefs in near real time, and for free.',
      type: 'text'
    }
  };

  render() {
    const { classes, showFullMap } = this.props;
    const chartContent = {
      title: 'Live Coral Cover',
      body: [
        { hardCoral: 0, sites: 31, label: 31 },
        { hardCoral: 5, sites: 51, label: 51 },
        { hardCoral: 10, sites: 79, label: 79 },
        { hardCoral: 15, sites: 85, label: 85 },
        { hardCoral: 20, sites: 75, label: 75 },
        { hardCoral: 25, sites: 77, label: 77 },
        { hardCoral: 30, sites: 62, label: 62 },
        { hardCoral: 35, sites: 75, label: 75 },
        { hardCoral: 40, sites: 54, label: 54 },
        { hardCoral: 45, sites: 50, label: 50 },
        { hardCoral: 50, sites: 30, label: 30 },
        { hardCoral: 55, sites: 25, label: 25 },
        { hardCoral: 60, sites: 20, label: 20 },
        { hardCoral: 65, sites: 11, label: 11 },
        { hardCoral: 70, sites: 7, label: 7 },
        { hardCoral: 75, sites: 7, label: 7 },
        { hardCoral: 80, sites: 2, label: 2 }
      ],
      type: 'chart'
    };

    const dashboard = showFullMap ? (
      <Grid container className={classes.root}>
        <Grid item sm={7} />
        <Grid item sm={5} className={classes.dashBoardProperty}>
          <Card content={this.state.content} />
          <MetricCards metrics={this.state.metrics} />
          <SiteList content={this.state.content} />
          <Card content={chartContent} />
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
