import React from 'react';

import { ReactComponent as Coral } from '../styles/Icons/coral.svg';
import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

import PropTypes from 'prop-types';

const coralStyleProperties = makeStyles(theme => ({
  reefProperty: {
    padding: '8px 8px 8px 0'
  },
  coralIconProperty: {
    width: '20px'
  },
  attributeWrapperProperty: {
    display: 'flex',
    justifyContent: 'center',
    width: '33%',
    margin: '0 8px 0 0',
    border: '1px solid',
    padding: '8px',
    borderRadius: '20px',
    [theme.breakpoints.down('sm')]: {
      margin: '8px 0 0 0',
      width: '100%'
    }
  }
}));

const CoralAttributes = ({ loadedSiteProperties }) => {
  const classes = coralStyleProperties();
  const mediaMax959 = useMediaQuery('(max-width:960px)');
  const spaceContent = mediaMax959 && ': ';

  return (
    <Box
      display="flex"
      flexDirection={mediaMax959 ? 'column' : 'row'}
      justifyContent="flex-start"
      className={classes.reefProperty}
    >
      <Box className={classes.attributeWrapperProperty}>
        <Coral className={classes.coralIconProperty} />
        <Box display="flex" alignItems="left" flexDirection={mediaMax959 ? 'row' : 'column'}>
          <Typography variant="body1">Reef Zone</Typography>
          <Typography variant="body1">
            <strong>
              {spaceContent}
              {loadedSiteProperties.reef_zone}
            </strong>
          </Typography>
        </Box>
      </Box>
      <Box className={classes.attributeWrapperProperty}>
        <Coral className={classes.coralIconProperty} />
        <Box display="flex" alignItems="left" flexDirection={mediaMax959 ? 'row' : 'column'}>
          <Typography variant="body1">Reef Type</Typography>
          <Typography variant="body1">
            <strong>
              {spaceContent}
              {loadedSiteProperties.reef_type}
            </strong>
          </Typography>
        </Box>
      </Box>
      <Box className={classes.attributeWrapperProperty}>
        <Coral className={classes.coralIconProperty} />
        <Box display="flex" alignItems="left" flexDirection={mediaMax959 ? 'row' : 'column'}>
          <Typography variant="body1">Exposure</Typography>
          <Typography variant="body1">
            <strong>
              {spaceContent}
              {loadedSiteProperties.exposure}
            </strong>
          </Typography>
        </Box>
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
