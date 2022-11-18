import React, { useState, useEffect, useMemo } from 'react';

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
import { chartContentProperties, chartTitles } from '../constants/transect-protocols';
import getChartContent from '../lib/chart-helpers';

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

  const siteChartCards = useMemo(() => {
    const selectedSiteProtocols = currentSelectedSite?.protocols;
    const bleachingProtocolSubItems = selectedSiteProtocols['colonies_bleached'];

    for (const [protocol, protocolProperties] of Object.entries(selectedSiteProtocols)) {
      const ignoreProtocols = ['colonies_bleached', 'habitatcomplexity'];

      if (!ignoreProtocols.includes(protocol)) {
        const isBleachingProtocol = protocol === 'quadrat_benthic_percent';
        const protocolName = isBleachingProtocol ? 'bleachingqc' : protocol;
        const dataPolicy = currentSelectedSite[`data_policy_${protocolName}`];
        const isPrivatePolicy = dataPolicy === 'private';
        const chartTitle = chartTitles[protocol];
        const chartInfoProperty = chartContentProperties[protocol];
        const chartInfo = isBleachingProtocol
          ? protocolProperties
          : protocolProperties[chartInfoProperty];

        const sourceContent = isPrivatePolicy
          ? defaultPieChartContent
          : getChartContent(chartInfo, isBleachingProtocol);

        return (
          <div key={protocol}>
            <InformationCard
              bleachingProtocolSubItems={bleachingProtocolSubItems}
              dataPolicy={dataPolicy}
              isPrivatePolicy={isPrivatePolicy}
              pieChartContent={sourceContent}
              projectFishFamilies={projectFishFamilies}
              protocol={protocolProperties}
              protocolName={protocolName}
              title={chartTitle}
              type="pieChart"
            />
          </div>
        );
      }
    }
  }, [currentSelectedSite, projectFishFamilies]);

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
