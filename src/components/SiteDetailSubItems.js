import React from 'react';

import ContactIcon from '@material-ui/icons/Email';

import { ThemeProvider } from 'styled-components/macro';
import { makeStyles } from '@material-ui/core/styles';
import { ButtonStyle } from './Button';
import { theme } from './theme';

import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

const subItemStyles = makeStyles(theme => ({
  iconProperty: {
    paddingRight: '5px'
  }
}));
const SiteDetailSubItems = ({ loadedSiteProperties }) => {
  const classes = subItemStyles();
  const siteYear = loadedSiteProperties.date_max && loadedSiteProperties.date_max.substring(0, 4);

  const contactButton = (
    <ThemeProvider theme={theme.cardButton}>
      <ButtonStyle setHover={true} boxShadow={true}>
        <Box p={1} display="flex" justifyContent="center">
          <ContactIcon fontSize="small" className={classes.iconProperty} />
          <Typography variant="body1" display="inline">
            Contact Admins
          </Typography>
        </Box>
      </ButtonStyle>
    </ThemeProvider>
  );

  return (
    <Box display="flex">
      <Box flexGrow={1}>
        <Box>
          <Typography variant="h4">{loadedSiteProperties.site_name}</Typography>
        </Box>
        <Box>
          <Typography variant="body1">{loadedSiteProperties.country_name}</Typography>
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
