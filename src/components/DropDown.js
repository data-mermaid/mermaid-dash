import React, { useState } from 'react';

import { default as ReactSelect } from 'react-select';
import styled from 'styled-components';
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import Box from '@material-ui/core/Box';

import PropTypes from 'prop-types';

const ProgressBarContainer = styled('div')`
  margin: 25px 0;
`;

const dropDownStyle = makeStyles(theme => ({
  root: {
    width: '100%',
    marginLeft: theme.spacing(2)
  }
}));

const DropDown = ({ siteList, siteClickHandler, selectSite }) => {
  const classes = dropDownStyle();
  const [loadedSiteList, setLoadedSiteList] = useState([]);
  const customStyles = {
    control: (base, state) => ({
      ...base,
      height: '62px',
      boxShadow:
        '0px 1px 3px 0px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 2px 1px -1px rgba(0,0,0,0.12)',
      borderRadius: 0
    })
  };

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
    <ReactSelect
      value={valueForSelect(selectSite)}
      placeholder="Select Site"
      onChange={siteClickHandler}
      options={loadedSiteList}
      styles={customStyles}
    />
  ) : (
    <ProgressBarContainer>
      <LinearProgress />
    </ProgressBarContainer>
  );

  return <Box className={classes.root}>{siteListComponent}</Box>;
};

DropDown.propTypes = {
  selectSite: PropTypes.object,
  siteList: PropTypes.array,
  siteSelectHandler: PropTypes.func,
  classes: PropTypes.object
};

export default DropDown;
