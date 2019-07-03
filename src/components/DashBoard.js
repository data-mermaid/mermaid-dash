import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import SiteList from './SiteList';
import PropTypes from 'prop-types';

const gridStyleProperties = theme => ({
  root: {
    flexGrow: 1
  },
  containerBox: {
    margin: '10px 0 0 0'
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

    const dashboard = showFullMap ? (
      <Grid container className={classes.containerBox}>
        <Grid item sm={6} />
        <Grid item sm={5}>
          <SiteList content={this.state.content} />
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
