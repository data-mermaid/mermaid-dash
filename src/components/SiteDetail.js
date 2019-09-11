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
    property: 'coral_cover',
    type: 'pieChart',
    sample: Samples.benthicPieChartData
  },
  {
    name: 'benthicpit',
    title: 'Benthic[PIT] Condition, % Cover',
    property: 'coral_cover',
    type: 'pieChart',
    sample: Samples.benthicPieChartData
  },
  {
    name: 'beltfish',
    title: 'Fish Belt',
    property: 'biomass_kgha_tg',
    type: 'pieChart',
    sample: Samples.fishBeltPieChartData
  }
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
    const loadedSiteProtocol = loadedSite && loadedSite.properties.protocols[protocol.name];
    const dataPolicy = loadedSiteProtocol && loadedSite.properties[`data_policy_${protocol.name}`];
    const privatePolicy = dataPolicy === 'private';

    const defaultBody = [
      { x: 'Herbivore-detritivore', y: 77.9 },
      { x: 'Herbivore-macroalgae', y: 24.1 },
      { x: 'Invertivore-mobile', y: 193.0 },
      { x: 'Invertivore-sessile', y: 34.6 },
      { x: 'Omnivore', y: 74.5 },
      { x: 'Piscivore', y: 177.4 }
    ];

    const defaultLegend = [
      { name: 'Herbivore-detritivore' },
      { name: 'Herbivore-macroalgae' },
      { name: 'Invertivore-mobile' },
      { name: 'Invertivore-sessile' },
      { name: 'Omnivore' },
      { name: 'Piscivore' }
    ];

    const convertContent = (content, protocol) => {
      return (
        content &&
        content.map(item => {
          const attribute = Object.keys(item)[0];
          const value =
            protocol === 'beltfish' ? Object.values(item)[0] : Object.values(item)[0] * 100;
          return { x: attribute, y: value };
        })
      );
    };

    const convertLegend = (content, protocol) => {
      const title = protocol === 'beltfish' ? 'Tropic group' : 'Benthic category';
      const data =
        content &&
        content.map(item => {
          const attribute = Object.keys(item)[0];
          return { name: attribute };
        });

      return { title, data };
    };

    const protocolContent =
      loadedSiteProtocol && loadedSite.properties.protocols[protocol.name][protocol.property];
    const sourceContent = privatePolicy
      ? defaultBody
      : convertContent(protocolContent, protocol.name);
    const sourceLegendData = privatePolicy
      ? { title: 'Private Group', data: defaultLegend }
      : convertLegend(protocolContent, protocol.name);

    const cardsComponent = loadedSiteProtocol && (
      <Card
        dataPolicy={dataPolicy}
        protocol={loadedSiteProtocol}
        protocolName={protocol.name}
        pieContent={sourceContent}
        legendContent={sourceLegendData}
        privatePolicy={privatePolicy}
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
