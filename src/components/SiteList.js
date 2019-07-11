import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import SiteDetail from './SiteDetail';
import DropDown from './DropDown';

import PropTypes from 'prop-types';

const siteListStyle = makeStyles(theme => ({
  root: {
    padding: theme.spacing(1, 0)
  }
}));

const SiteList = ({ sites, siteSelectHandler, selectSite }) => {
  const classes = siteListStyle();
  const newSiteList = sites.map(site => {
    return {
      key: site.id,
      label: site.properties.site_name,
      value: site.properties.site_name
    };
  });

  return (
    <Grid container className={classes.root}>
      <DropDown
        selectSite={selectSite}
        siteList={newSiteList}
        siteSelectHandler={siteSelectHandler}
      />
      <SiteDetail selectSite={selectSite} />
    </Grid>
  );
};

SiteList.propTypes = {
  sites: PropTypes.array,
  siteSelectHandler: PropTypes.func,
  selectSite: PropTypes.object
};
export default SiteList;
