import React, { useState } from 'react';

import AdminIcon from '@material-ui/icons/Person';
import { ReactComponent as OrganizationIcon } from '../styles/Icons/earth.svg';

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

const protocolsArray = [
  {
    name: 'benthiclit',
    title: 'Benthic[LIT] Condition, % Cover',
    type: 'pieChart',
    sample: Samples.benthicPieChartData
  },
  {
    name: 'benthicpit',
    title: 'Benthic[PIT] Condition, % Cover',
    type: 'pieChart',
    sample: Samples.benthicPieChartData
  },
  { name: 'beltfish', title: 'Fish Belt', type: 'pieChart', sample: Samples.fishBeltPieChartData }
];
const containerStyle = makeStyles(theme => ({
  root: {
    paddingBottom: theme.spacing(2),
    paddingLeft: theme.spacing(1)
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

  const siteAdmins = loadedSite && loadedSite.properties.project_admins && (
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

  const siteOrganizations = loadedSite && loadedSite.properties.tags && (
    <Box pt={1} display="flex">
      <OrganizationIcon width="20px" height="20px" />
      <Typography variant="body1">
        Organizations:{' '}
        {loadedSite.properties.tags
          .map(organization => {
            return organization.name;
          })
          .join(', ')}
      </Typography>
    </Box>
  );

  const SiteDetailCards = protocolsArray.map(protocol => {
    const checkLoadedSiteProtocol = loadedSite && loadedSite.properties.protocols[protocol.name];
    const loadedSiteProtocol =
      checkLoadedSiteProtocol && loadedSite.properties.protocols[protocol.name];
    const pieChartContent =
      checkLoadedSiteProtocol && loadedSite.properties.protocols[protocol.name].coral_cover;
    const defaultBody = [
      { x: 'Herbivore-detritivore', y: 6 },
      { x: 'Herbivore-macroalgae', y: 8 },
      { x: 'Invertivore-mobile', y: 12 },
      { x: 'Invertivore-sessile', y: 10 },
      { x: 'Omnivore', y: 20 },
      { x: 'Piscivore', y: 14 },
      { x: 'Planktivore', y: 30 }
    ];

    const defaultLegend = [
      { name: 'Herbivore-detritivore' },
      { name: 'Herbivore-macroalgae' },
      { name: 'Invertivore-mobile' },
      { name: 'Invertivore-sessile' },
      { name: 'Omnivore' },
      { name: 'Piscivore' },
      { name: 'Planktivore' }
    ];

    const pieContent = pieChartContent
      ? pieChartContent.map(item => {
          const attribute = Object.keys(item)[0];
          const value = (Object.values(item)[0] * 100).toFixed(2);
          return { x: attribute, y: value };
        })
      : defaultBody;

    const legendData =
      pieChartContent &&
      pieChartContent.map(item => {
        const attribute = Object.keys(item)[0];
        return { name: attribute };
      });

    const legendContent = pieChartContent
      ? { title: 'Benthic category', data: legendData }
      : { title: 'Tropic group', data: defaultLegend };

    const cardsComponent = checkLoadedSiteProtocol && (
      <Card
        dataPolicy={loadedSite.properties[`data_policy_${protocol.name}`]}
        protocol={loadedSiteProtocol}
        protocolName={protocol.name}
        pieContent={pieContent}
        legendContent={legendContent}
        sampleUnitCounts={loadedSiteProtocol.sample_unit_count}
        title={protocol.title}
        type={protocol.type}
      />
    );

    return <div key={protocol.name}>{cardsComponent}</div>;
  });

  const site = loadedSite ? (
    <div className={classes.root}>
      <Paper className={classes.siteWrapper}>
        <SiteDetailSubItems loadedSiteProperties={loadedSite.properties} />
        {siteAdmins}
        {siteOrganizations}
        <CoralAttributes loadedSiteProperties={loadedSite.properties} />
        <SiteNote loadedSiteProperties={loadedSite.properties} />
      </Paper>
      {SiteDetailCards}
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
