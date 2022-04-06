import React from 'react';

import ContactIcon from '@material-ui/icons/Email';

import { ThemeProvider } from 'styled-components/macro';
import { makeStyles } from '@material-ui/core/styles';
import { ButtonStyle, MenuLink } from '../styles/MermaidStyledComponents';
import { theme } from '../constants/theme';

import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

const subItemStyles = makeStyles(theme => ({
  iconProperty: {
    paddingRight: '5px'
  }
}));

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

  const dateParts = siteDate.split('-').join(',');
  const dateObject = new Date(dateParts);
  const year = dateObject.getFullYear();
  const date = dateObject.getDate();
  const month = months[dateObject.getMonth()];

  return `${month} ${date}, ${year}`;
};

const SiteDetailSubItems = ({ loadedSiteProperties }) => {
  const classes = subItemStyles();
  const {
    site_name,
    project_name,
    management_regimes,
    contact_link,
    sample_date
  } = loadedSiteProperties;
  const siteDate = formatDate(sample_date);

  const contactButton = (
    <ThemeProvider theme={theme.cardButton}>
      <MenuLink target="_blank" href={contact_link} rel="noopener noreferrer">
        <ButtonStyle setHover={true}>
          <ContactIcon fontSize="small" className={classes.iconProperty} />
          <Box fontWeight="fontWeightMedium">Contact Admins</Box>
        </ButtonStyle>
      </MenuLink>
    </ThemeProvider>
  );

  return (
    <Box display="flex">
      <Box flexGrow={1}>
        <Typography variant="h4">{site_name}</Typography>
        <Typography variant="body1">{project_name}</Typography>
        <Typography variant="body1">
          {management_regimes
            ? management_regimes
                .map(mr => {
                  return mr.name;
                })
                .join(', ')
            : 'No managements'}
        </Typography>
        <Typography variant="body1">{siteDate}</Typography>
      </Box>
      <Box>{contactButton}</Box>
    </Box>
  );
};

export default SiteDetailSubItems;
