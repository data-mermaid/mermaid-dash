import React, { useState } from 'react';

import AdminIcon from '@material-ui/icons/Person';
import { ReactComponent as OrganizationIcon } from '../styles/Icons/earth.svg';
import makeStyles from '@material-ui/core/styles/makeStyles';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

import SiteDetailSubItems from './SiteDetailSubItems';
import CoralAttributes from './CoralAttributes';
import SiteNote from './SiteNote';
import InformationCard from './InformationCard';
import { TextLoader } from './Loader';
import { pieChartDefault } from '../constants/sample-data';
import { protocolsArray, bleachingCategories } from '../constants/transect-protocols';

import PropTypes from 'prop-types';

const containerStyle = makeStyles(theme => ({
  root: {
    padding: '16px 8px 100px 8px'
  },
  siteWrapper: {
    padding: theme.spacing(2, 2),
    marginBottom: theme.spacing(2),
    borderRadius: 0
  },
  reefProperty: {
    padding: '8px 8px 8px 0'
  },
  siteInfoCardProperty: {
    padding: 0
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
      <AdminIcon width="20px" height="20px" />
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
      <OrganizationIcon width="23px" />
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
    const bleachingProtocol = protocol.name === 'bleachingqc';
    const fishBeltProtocol = protocol.name === 'beltfish';
    const transectProperty = bleachingProtocol ? protocol.property : protocol.name;
    const bleachingSubItems = loadedSite && loadedSite.properties.protocols['colonies_bleached'];
    const loadedSiteProtocol = loadedSite && loadedSite.properties.protocols[transectProperty];

    const dataPolicy = loadedSiteProtocol && loadedSite.properties[`data_policy_${protocol.name}`];
    const setToPrivate = dataPolicy === 'private';

    const generatePrivateLabel = protocol_title =>
      `This data is unavailable because ${protocol_title} Sample Units are set to Private for this project.`;

    const convertContent = content => {
      return (
        content &&
        (bleachingProtocol
          ? bleachingCategories.map(item => {
              return { x: item.name, y: content[item.type] };
            })
          : content.map(item => {
              const attribute = Object.keys(item)[0];
              const value = fishBeltProtocol
                ? Object.values(item)[0]
                : Object.values(item)[0] * 100;
              return { x: attribute, y: value };
            }))
      );
    };

    const convertLegend = (content, protocol) => {
      const { legendTitle: title } = protocol;

      const data = bleachingProtocol
        ? bleachingCategories.map(item => {
            return { name: item.name };
          })
        : content &&
          content.map(item => {
            const attribute = Object.keys(item)[0];
            return { name: attribute };
          });

      return { title, data };
    };

    const protocolContent =
      loadedSiteProtocol &&
      (bleachingProtocol ? loadedSiteProtocol : loadedSiteProtocol[protocol.property]);

    const sourceContent = setToPrivate ? pieChartDefault.body : convertContent(protocolContent);

    const sourceLegendData = setToPrivate
      ? { title: pieChartDefault.legendTitle, data: pieChartDefault.legend }
      : convertLegend(protocolContent, protocol);

    const cardsComponent = loadedSiteProtocol && (
      <InformationCard
        dataPolicy={dataPolicy}
        protocol={loadedSiteProtocol}
        protocolName={protocol.name}
        pieChartContent={sourceContent}
        pieChartLegend={sourceLegendData}
        setToPrivate={setToPrivate}
        privateLabel={generatePrivateLabel(protocol.title)}
        bleachingSubItems={bleachingSubItems}
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
