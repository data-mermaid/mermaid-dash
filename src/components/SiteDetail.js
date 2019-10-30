import React, { useState } from 'react';

import useMediaQuery from '@material-ui/core/useMediaQuery';
import styled from 'styled-components/macro';

import AdminIcon from '@material-ui/icons/Person';
import { ReactComponent as OrganizationIcon } from '../styles/Icons/earth.svg';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

import PropTypes from 'prop-types';
import SiteDetailSubItems from './SiteDetailSubItems';
import CoralAttributes from './CoralAttributes';
import SiteNote from './SiteNote';
import InformationCard from './InformationCard';
import { TextLoader } from './Loader';
import { defaultPieChartContent } from '../constants/sample-data';
import { protocolsArray, bleachingCategories } from '../constants/transect-protocols';

const SiteSummaryWrapper = styled('div')`
  padding: ${props => (props.mediaMax960 ? '0 8px 100px 8px' : '16px 8px 100px 8px')};
`;

const SiteInfoWrapper = styled(Paper)`
  padding: 16px 16px;
  margin-bottom: 16px;
  border-radius: 0;
`;

const SiteDetail = ({ selectSite }) => {
  const mediaMax960 = useMediaQuery('(max-width:960px');
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

  const siteChartCards = protocolsArray.map(protocol => {
    const bleachingProtocol = protocol.name === 'bleachingqc';
    const fishBeltProtocol = protocol.name === 'beltfish';
    const transectProperty = bleachingProtocol ? protocol.property : protocol.name;
    const bleachingSubItems = loadedSite && loadedSite.properties.protocols['colonies_bleached'];
    const loadedSiteProtocol = loadedSite && loadedSite.properties.protocols[transectProperty];

    const dataPolicy = loadedSiteProtocol && loadedSite.properties[`data_policy_${protocol.name}`];
    const setToPrivate = dataPolicy === 'private';

    const generatePrivateLabel = protocolTitle =>
      `This data is unavailable because ${protocolTitle} Sample Units are set to Private for this project.`;

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

    const protocolContent =
      loadedSiteProtocol &&
      (bleachingProtocol ? loadedSiteProtocol : loadedSiteProtocol[protocol.property]);
    const sourceData = convertContent(protocolContent);
    const sourceContent = setToPrivate ? defaultPieChartContent : sourceData;

    const cardsComponent = loadedSiteProtocol && (
      <InformationCard
        dataPolicy={dataPolicy}
        protocol={loadedSiteProtocol}
        protocolName={protocol.name}
        pieChartContent={sourceContent}
        setToPrivate={setToPrivate}
        privateLabel={generatePrivateLabel(protocol.title)}
        bleachingSubItems={bleachingSubItems}
        title={protocol.title}
        type={protocol.type}
      />
    );

    return <div key={protocol.name}>{cardsComponent}</div>;
  });

  const siteInfoCard = loadedSite ? (
    <SiteInfoWrapper>
      <SiteDetailSubItems loadedSiteProperties={loadedSite.properties} />
      {siteAdmins}
      {siteOrganizations}
      <CoralAttributes loadedSiteProperties={loadedSite.properties} />
      <SiteNote loadedSiteProperties={loadedSite.properties} />
    </SiteInfoWrapper>
  ) : (
    <SiteInfoWrapper>
      <TextLoader />
    </SiteInfoWrapper>
  );

  return (
    <SiteSummaryWrapper mediaMax960={mediaMax960}>
      {siteInfoCard}
      {siteChartCards}
    </SiteSummaryWrapper>
  );
};

SiteDetail.propTypes = {
  selectSite: PropTypes.shape({
    id: PropTypes.string.isRequired
  })
};

export default SiteDetail;
