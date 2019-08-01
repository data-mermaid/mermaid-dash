import React from 'react';

import { ReactComponent as Coral } from '../styles/Icons/coral.svg';
import { makeStyles } from '@material-ui/core/styles';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

import PropTypes from 'prop-types';

const coralStyleProperties = makeStyles(theme => ({
  reefProperty: {
    padding: '8px 8px 8px 0'
  },
  coralIconProperty: {
    paddingRight: theme.spacing(1),
    width: '25px'
  }
}));

const CoralAttributes = ({ loadedSiteProperties }) => {
  const classes = coralStyleProperties();

  return (
    <Box
      display="flex"
      flexDirection="row"
      justifyContent="flex-start"
      className={classes.reefProperty}
    >
      <Box p={1} mr={1} border={1} borderRadius={13} display="flex" alignItems="center">
        <Coral className={classes.coralIconProperty} />
        <Typography variant="body1">
          Exposure: <strong>{loadedSiteProperties.exposure}</strong>
        </Typography>
      </Box>
      <Box p={1} mr={1} border={1} borderRadius={13} display="flex" alignItems="center">
        <Coral className={classes.coralIconProperty} />
        <Typography variant="body1">
          Reef Type: <strong>{loadedSiteProperties.reef_type}</strong>
        </Typography>
      </Box>
      <Box p={1} mr={1} border={1} borderRadius={13} display="flex" alignItems="center">
        <Coral className={classes.coralIconProperty} />
        <Typography variant="body1">
          Reef Zone: <strong>{loadedSiteProperties.reef_zone}</strong>
        </Typography>
      </Box>
    </Box>
  );
};

CoralAttributes.propTypes = {
  loadedSiteProperties: PropTypes.shape({
    exposure: PropTypes.string,
    reef_type: PropTypes.string,
    reef_zone: PropTypes.string
  }),
  classes: PropTypes.object
};
export default CoralAttributes;
