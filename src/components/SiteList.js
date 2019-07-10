import React, { Component } from 'react';
import summary from '../apis/summary';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import SiteDetail from './SiteDetail';
import DropDown from './DropDown';

const siteListStyle = theme => ({
  root: {
    padding: theme.spacing(1, 0)
  }
});
class SiteList extends Component {
  state = {
    sites: [],
    selectSite: null
  };

  async componentDidMount() {
    const {
      data: { features: sites }
    } = await summary.get('/sites');
    this.setState({ sites });
  }

  siteSelectHandler = selectedOption => {
    this.setState({ selectSite: selectedOption });
  };

  render() {
    const { classes } = this.props;
    const newSiteList = this.state.sites.map(site => {
      return {
        key: site.id,
        label: site.properties.site_name,
        value: site.properties.site_name
      };
    });

    return (
      <Grid container className={classes.root}>
        <DropDown
          selectSite={this.state.selectSite}
          siteList={newSiteList}
          siteSelectHandler={this.siteSelectHandler}
        />
        <SiteDetail selectSite={this.state.selectSite} />
      </Grid>
    );
  }
}

export default withStyles(siteListStyle)(SiteList);
