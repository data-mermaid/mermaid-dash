import React from 'react';

import styled from 'styled-components/macro';
import { ThemeProvider } from 'styled-components/macro';
import { ButtonStyle, MenuLink } from '../styles/MermaidStyledComponents';
import { theme } from '../constants/theme';
import ContactIcon from '@material-ui/icons/Email';

import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

const ContactIconWrapper = styled(ContactIcon)`
  padding-right: 5px;
  font-size: small;
`;

const SiteDetailSubItemWrapper = styled('div')`
  div {
    &:first-child {
      display: flex;
      width: 100%;
      h4 {
        flex-grow: 1;
      }
    }
  }
`;

const SampleDateDropdownWrapper = styled('div')`
  padding-bottom: 5px;
  label,
  select {
    font-size: 1rem;
    padding-right: 5px;
  }
`;

const formatDate = siteDate => {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];

  const dateParts = siteDate.split('-');
  const year = dateParts[0];
  const month = months[Number(dateParts[1]) - 1];
  const date = dateParts[2];

  return `${month} ${date}, ${year}`;
};

const SampleDateDropdown = ({
  currentSelectedSite,
  markerSelectSites,
  handleCurrentSelectedSiteChange
}) => {
  const sampleDateCounts = {};
  for (const event of markerSelectSites) {
    sampleDateCounts[event.sample_date] = sampleDateCounts[event.sample_date]
      ? sampleDateCounts[event.sample_date] + 1
      : 1;
  }

  const sampleDates = markerSelectSites.map(site => {
    return (
      <option key={site.sample_event_id} value={site.sample_event_id}>
        {formatDate(site.sample_date)}
        {sampleDateCounts[site.sample_date] > 1 && ` - ${site.management_name}`}
      </option>
    );
  });

  return (
    <SampleDateDropdownWrapper>
      <label htmlFor="sample-date-select">Sample date:</label>
      <select
        id="sample-date-select"
        value={currentSelectedSite.sample_event_id}
        onChange={handleCurrentSelectedSiteChange}
      >
        {sampleDates}
      </select>
    </SampleDateDropdownWrapper>
  );
};

const SiteDetailSubItems = ({
  currentSelectedSite,
  markerSelectSites,
  handleCurrentSelectedSiteChange
}) => {
  const {
    site_name,
    project_name,
    management_name,
    contact_link,
    sample_date
  } = currentSelectedSite;

  const siteDate =
    markerSelectSites.length > 1 ? (
      <SampleDateDropdown
        currentSelectedSite={currentSelectedSite}
        markerSelectSites={markerSelectSites}
        handleCurrentSelectedSiteChange={handleCurrentSelectedSiteChange}
      />
    ) : (
      <Typography variant="body1">{formatDate(sample_date)}</Typography>
    );

  const contactButton = (
    <ThemeProvider theme={theme.cardButton}>
      <MenuLink target="_blank" href={contact_link} rel="noopener noreferrer">
        <ButtonStyle setHover={true}>
          <ContactIconWrapper />
          <Box fontWeight="fontWeightMedium">Contact Admins</Box>
        </ButtonStyle>
      </MenuLink>
    </ThemeProvider>
  );

  return (
    <SiteDetailSubItemWrapper>
      <div>
        <Typography variant="h4">{site_name}</Typography>
        {contactButton}
      </div>
      <div>
        <Typography variant="body1">{project_name}</Typography>
        <Typography variant="body1">{management_name}</Typography>
        {siteDate}
      </div>
    </SiteDetailSubItemWrapper>
  );
};

export default SiteDetailSubItems;
