import React, { useState } from 'react';

import AdminIcon from '@material-ui/icons/Person';

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';

import { TextLoader } from './Loader';

import SiteDetailSubItems from './SiteDetailSubItems';
import CoralAttributes from './CoralAttributes';
import SiteNote from './SiteNote';
import Card from './Card';
import Samples from '../sample_data/sampleSummaryStatistic';

import PropTypes from 'prop-types';

const containerStyle = makeStyles(theme => ({
  root: {
    paddingBottom: theme.spacing(10)
  },
  siteWrapper: {
    padding: theme.spacing(2, 2),
    marginBottom: theme.spacing(2),
    borderRadius: 0
  },
  reefProperty: {
    padding: '8px 8px 8px 0'
  }
}));

const SiteDetail = ({ selectSite }) => {
  const classes = containerStyle();
  const [loadedSite, setLoadedSite] = useState(null);

  if (selectSite && (!loadedSite || loadedSite.id !== selectSite.id)) {
    setLoadedSite(selectSite);
  }

  const siteAdmins = loadedSite && (
    <Box borderTop={1} pt={1} display="flex">
      <AdminIcon />
      <Typography variant="body1">
        Admins:{' '}
        {loadedSite.properties.project_admins
          .map(admin => {
            return admin.name;
          })
          .join(', ')}
      </Typography>
    </Box>
  );

  const benthicCard = loadedSite &&
    (loadedSite.properties.protocols.benthiclit || loadedSite.properties.protocols.benthicpit) && (
      <Card
        content={Samples.benthicPieChartData}
        dataPolicy={loadedSite.properties.data_policy_benthiclit}
        protocols={loadedSite.properties.protocols}
      />
    );

  const fishbeltCard = loadedSite && loadedSite.properties.protocols.beltfish && (
    <Card
      content={Samples.fishBeltPieChartData}
      dataPolicy={loadedSite.properties.data_policy_beltfish}
      protocols={loadedSite.properties.protocols}
      sampleUnits={loadedSite.properties.protocols.beltfish.sample_unit_count}
    />
  );

  const site = loadedSite ? (
    <div className={classes.root}>
      <Paper className={classes.siteWrapper}>
        <SiteDetailSubItems loadedSiteProperties={loadedSite.properties} />
        {siteAdmins}
        <CoralAttributes loadedSiteProperties={loadedSite.properties} />
        <SiteNote loadedSiteProperties={loadedSite.properties} />
      </Paper>
      {benthicCard}
      {fishbeltCard}
    </div>
  ) : (
    <Paper className={classes.siteWrapper}>
      <TextLoader />
    </Paper>
  );

  return <div>{site}</div>;
};

SiteDetail.propTypes = {
  selectSite: PropTypes.shape({
    id: PropTypes.string.isRequired
  }),
  classes: PropTypes.object
};

export default SiteDetail;
