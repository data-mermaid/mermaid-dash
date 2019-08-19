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
const SiteDetailSubItems = loadedSite => {
  const classes = subItemStyles();

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
          <Typography variant="h4">{loadedSite.properties.site_name}</Typography>
        </Box>
        <Box>
          <Typography variant="body1">{loadedSite.properties.country_name}</Typography>
        </Box>
        <Box>
          <Typography variant="body1">
            {loadedSite.properties.management_regimes
              ? loadedSite.properties.management_regimes
                  .map(mr => {
                    return mr.name;
                  })
                  .join(', ')
              : 'No managements'}
          </Typography>
        </Box>
        <Box>
          <Typography variant="body1">{loadedSite.properties.date_max}</Typography>
        </Box>
      </Box>
      <Box>{contactButton}</Box>
    </Box>
  );
};

export default SiteDetailSubItems;
