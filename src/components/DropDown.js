import React, { useState } from 'react';

import { default as ReactSelect } from 'react-select';
import styled from 'styled-components';
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';

import PropTypes from 'prop-types';

const ProgressBarContainer = styled('div')`
  margin: 25px 0;
`;

const dropDownStyle = makeStyles(theme => ({
  root: {
    paddingBottom: theme.spacing(2),
    paddingLeft: theme.spacing(1)
  }
}));

const Select = styled(ReactSelect)`
  div {
    border-radius: 0px !important;
  }
`;

const DropDown = ({ siteList, siteClickHandler, selectSite }) => {
  const classes = dropDownStyle();
  const [loadedSiteList, setLoadedSiteList] = useState([]);

  if (siteList && (!loadedSiteList[0] || siteList[0].id !== loadedSiteList[0].key)) {
    const loadedList = siteList.map(site => {
      return {
        key: site.id,
        value: `${site.properties.site_name} - ${site.properties.project_name}`,
        label: `${site.properties.site_name} - ${site.properties.project_name}`
      };
    });
    setLoadedSiteList(loadedList);
  }

  const valueForSelect = site => {
    if (site.id) {
      site.label = `${site.properties.site_name} - ${site.properties.project_name}`;
      return site;
    }
  };

  const siteListComponent = loadedSiteList ? (
    <Select
      value={valueForSelect(selectSite)}
      placeholder="Select Site"
      onChange={siteClickHandler}
      options={loadedSiteList}
      className={classes.root}
    />
  ) : (
    <ProgressBarContainer>
      <LinearProgress />
    </ProgressBarContainer>
  );

  return (
    <Grid item xs={12}>
      {siteListComponent}
    </Grid>
  );
};

DropDown.propTypes = {
  selectSite: PropTypes.object,
  siteList: PropTypes.array,
  siteSelectHandler: PropTypes.func
};

export default DropDown;
