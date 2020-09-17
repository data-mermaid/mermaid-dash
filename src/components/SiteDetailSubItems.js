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

const SiteDetailSubItems = ({ loadedSiteProperties }) => {
  const classes = subItemStyles();
  const startDate = loadedSiteProperties.date_min && loadedSiteProperties.date_min.substring(0, 4);
  const endDate = loadedSiteProperties.date_max && loadedSiteProperties.date_max.substring(0, 4);
  const siteYear = endDate === startDate ? endDate : `${startDate} - ${endDate}`;

  const contactButton = (
    <ThemeProvider theme={theme.cardButton}>
      <MenuLink target="_blank" href={loadedSiteProperties.contact_link} rel="noopener noreferrer">
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
        <Box>
          <Typography variant="h4">{loadedSiteProperties.site_name}</Typography>
        </Box>
        <Box>
          <Typography variant="body1">{loadedSiteProperties.project_name}</Typography>
        </Box>
        <Box>
          <Typography variant="body1">
            {loadedSiteProperties.management_regimes
              ? loadedSiteProperties.management_regimes
                  .map(mr => {
                    return mr.name;
                  })
                  .join(', ')
              : 'No managements'}
          </Typography>
        </Box>
        <Box>
          <Typography variant="body1">{siteYear}</Typography>
        </Box>
      </Box>
      <Box>{contactButton}</Box>
    </Box>
  );
};

export default SiteDetailSubItems;
