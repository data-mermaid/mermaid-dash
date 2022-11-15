import React, { useState, useEffect } from 'react';

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
import { availableProtocolsForChart, bleachingCategories } from '../constants/transect-protocols';

const SiteSummaryWrapper = styled('div')`
  padding: ${props => (props.mediaMax960 ? '0 8px 0px 8px' : '16px 8px 50px 8px')};
  width: 100%;
`;

const SiteInfoWrapper = styled(Paper)`
  padding: 16px 16px;
  margin-bottom: 16px;
  border-radius: 0;
`;

const SiteDetail = ({ selectSite, projectFishFamilies }) => {
  const mediaMax960 = useMediaQuery('(max-width:960px');
  const [currentSelectedSite, setCurrentSelectedSite] = useState(selectSite[0]);

  useEffect(() => {
    setCurrentSelectedSite(selectSite[0]);
  }, [selectSite]);

  const handleCurrentSelectedSiteChange = event => {
    const filterSampleEventSite = selectSite.filter(
      site => site.sample_event_id === event.target.value
    )[0];
    setCurrentSelectedSite(filterSampleEventSite);
  };

  const siteAdmins = currentSelectedSite && currentSelectedSite.project_admins && (
    <Box borderTop={1} pt={1} display="flex">
      <AdminIcon width="20px" height="20px" />
      <Typography variant="body1">
        Admins:{' '}
        {currentSelectedSite.project_admins
          .map(admin => {
            return admin.name;
          })
          .join(', ')}
      </Typography>
    </Box>
  );

  const siteOrganizations = currentSelectedSite && currentSelectedSite.tags && (
    <Box pt={1} display="flex">
      <OrganizationIcon width="23px" />
      <Typography variant="body1">
        Organizations:{' '}
        {currentSelectedSite.tags
          .map(organization => {
            return organization.name;
          })
          .join(', ')}
      </Typography>
    </Box>
  );

  const siteChartCards = availableProtocolsForChart.map(({ name, property, title, type }) => {
    const bleachingProtocol = name === 'bleachingqc';
    const transectName = bleachingProtocol ? property : name;
    const loadedSiteProtocol = currentSelectedSite && currentSelectedSite.protocols[transectName];
    const bleachingSubItems =
      currentSelectedSite && currentSelectedSite.protocols['colonies_bleached'];

    const dataPolicy = loadedSiteProtocol && currentSelectedSite[`data_policy_${name}`];
    const setToPrivate = dataPolicy === 'private';

    const generatePrivateLabel = protocolTitle =>
      `This data is unavailable because ${protocolTitle} Sample Units are set to Private for this project.`;

    const convertContent = content => {
      let contentArr = [];
      for (const item in content) {
        const newObject = {};
        newObject[item] = content[item];
        contentArr.push(newObject);
      }

      return (
        content &&
        (bleachingProtocol
          ? bleachingCategories.map(({ name, type }) => {
              return { x: name, y: content[type] || 0 };
            })
          : contentArr.map(item => {
              const attribute = Object.keys(item)[0];
              const value = Object.values(item)[0];
              return { x: attribute, y: value };
            }))
      );
    };

    const protocolContent =
      loadedSiteProtocol && (bleachingProtocol ? loadedSiteProtocol : loadedSiteProtocol[property]);
    const sourceContent = setToPrivate ? defaultPieChartContent : convertContent(protocolContent);

    const cardsComponent = loadedSiteProtocol && (
      <InformationCard
        dataPolicy={dataPolicy}
        protocol={loadedSiteProtocol}
        protocolName={name}
        pieChartContent={sourceContent}
        setToPrivate={setToPrivate}
        privateLabel={generatePrivateLabel(title)}
        bleachingSubItems={bleachingSubItems}
        title={title}
        type={type}
        projectFishFamilies={projectFishFamilies}
      />
    );

    return <div key={name}>{cardsComponent}</div>;
  });

  const siteInfoCard = currentSelectedSite ? (
    <SiteInfoWrapper>
      <SiteDetailSubItems
        currentSelectedSite={currentSelectedSite}
        markerSelectSites={selectSite}
        handleCurrentSelectedSiteChange={handleCurrentSelectedSiteChange}
      />
      {siteAdmins}
      {siteOrganizations}
      <CoralAttributes currentSelectedSite={currentSelectedSite} />
      <SiteNote loadedSiteProperties={selectSite} currentSelectedSite={currentSelectedSite} />
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
  selectSite: PropTypes.arrayOf(
    PropTypes.shape({
      site_id: PropTypes.string.isRequired
    })
  )
};

export default SiteDetail;
