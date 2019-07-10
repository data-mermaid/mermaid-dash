import React, { Component } from 'react';

import Select from 'react-select';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';

const dropDownStyle = theme => ({
  root: {
    padding: theme.spacing(1, 0)
  }
});
class DropDown extends Component {
  render() {
    const { classes } = this.props;

    const siteList =
      this.props.siteList.length > 0 ? (
        <Select
          value={this.props.selectSite}
          placeholder="Select Site"
          onChange={this.props.siteSelectHandler}
          options={this.props.siteList}
          className={classes.root}
        />
      ) : (
        <div>Loading</div>
      );

    return (
      <Grid item xs={12}>
        {siteList}
      </Grid>
    );
  }
}

DropDown.propTypes = {
  selectSite: PropTypes.object,
  siteList: PropTypes.array,
  siteSelectHandler: PropTypes.func
};

export default withStyles(dropDownStyle)(DropDown);
