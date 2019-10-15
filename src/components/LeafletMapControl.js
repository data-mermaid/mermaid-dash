import React from 'react';

import Box from '@material-ui/core/Box';
import makeStyles from '@material-ui/core/styles/makeStyles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { ThemeProvider } from 'styled-components/macro';
import { ReactComponent as SinglePointIcon } from '../styles/Icons/circular-shape-silhouette.svg';
import { ReactComponent as MultiPointsIcon } from '../styles/Icons/four.svg';
import { ReactComponent as SelectMultiIcon } from '../styles/Icons/two.svg';
import { ReactComponent as SelectMarkerIcon } from '../styles/Icons/pin.svg';
import ZoomOutIcon from '@material-ui/icons/ZoomOutMap';
import CurrentSelectLocationIcon from '@material-ui/icons/TripOrigin';

import Tooltip from '@material-ui/core/Tooltip';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Fade from '@material-ui/core/Fade';

import { ButtonStyle } from '../styles/MermaidStyledComponents';
import { theme } from './theme';

import PropTypes from 'prop-types';

const mapControlStyleProperty = makeStyles(theme => ({
  zoomToIconWrapperProperty: {
    position: 'fixed',
    top: 170,
    left: 11,
    zIndex: 1000
  },
  zoomOutIconWrapperProperty: {
    position: 'fixed',
    top: 130,
    left: 11,
    zIndex: 1000
  },
  mapControlIconProperty: {
    width: '18px',
    height: '18px'
  },
  legendProperty: {
    position: 'fixed',
    width: 200,
    height: 130,
    bottom: 10,
    left: 250,
    color: 'white',
    opacity: 0.6,
    backgroundColor: '#000000',
    borderRadius: 0,
    boxShadow: 'none',
    zIndex: 1000
  },
  legendItemProperty: {
    padding: '5px 0 10px 0px'
  },
  legendIconProperty: {
    margin: '3px 8px 0 4px'
  },
  legendMarkerIconProperty: {
    marginRight: '5px',
    marginLeft: '2px'
  }
}));

const LeafletMapControl = ({ fullMapZoomHandler, zoomToSiteHandler }) => {
  const classes = mapControlStyleProperty();
  const mediaMax960 = useMediaQuery('(min-width:960px');

  const fullMapToggle = (
    <ThemeProvider theme={theme.mapControl}>
      <Tooltip
        title="Zoom to Full"
        placement="right"
        TransitionComponent={Fade}
        TransitionProps={{ timeout: 200 }}
      >
        <ButtonStyle
          buttonBorder={true}
          growScaleHover={true}
          onClick={() => fullMapZoomHandler(true)}
        >
          <ZoomOutIcon className={classes.mapControlIconProperty} />
        </ButtonStyle>
      </Tooltip>
    </ThemeProvider>
  );

  const zoomToSelectSite = (
    <ThemeProvider theme={theme.mapControl}>
      <Tooltip
        title="Zoom to Selected Site"
        placement="right"
        TransitionComponent={Fade}
        TransitionProps={{ timeout: 200 }}
      >
        <ButtonStyle buttonBorder={true} setWiggle={true} onClick={() => zoomToSiteHandler(true)}>
          <CurrentSelectLocationIcon className={classes.mapControlIconProperty} />
        </ButtonStyle>
      </Tooltip>
    </ThemeProvider>
  );

  const fullMapControl = <Box className={classes.zoomOutIconWrapperProperty}>{fullMapToggle}</Box>;
  const zoomToControl = <Box className={classes.zoomToIconWrapperProperty}>{zoomToSelectSite}</Box>;
  const mapLegend = (
    <Paper className={classes.legendProperty}>
      <Box display="flex" flexDirection="column" className={classes.legendItemProperty}>
        <Box display="flex" m={1}>
          <SelectMarkerIcon
            width="20px"
            height="20px"
            className={classes.legendMarkerIconProperty}
          />
          <Typography variant="body2">Selected Project Site</Typography>
        </Box>
        <Box display="flex" ml={1} mb={1}>
          <SelectMultiIcon width="15px" height="15px" className={classes.legendIconProperty} />
          <Typography variant="body2">Selected Multiple Sites</Typography>
        </Box>
        <Box display="flex" ml={1} mb={1}>
          <SinglePointIcon width="15px" height="15px" className={classes.legendIconProperty} />
          <Typography variant="body2">Project Site</Typography>
        </Box>
        <Box display="flex" ml={1} mb={1}>
          <MultiPointsIcon width="15px" height="15px" className={classes.legendIconProperty} />
          <Typography variant="body2">Multiple Project Sites</Typography>
        </Box>
      </Box>
    </Paper>
  );
  return (
    <div>
      {fullMapControl}
      {zoomToControl}
      {mediaMax960 && mapLegend}
    </div>
  );
};

LeafletMapControl.propTypes = {
  fullMapZoomHandler: PropTypes.func,
  zoomToSiteHandler: PropTypes.func,
  classes: PropTypes.object
};

export default LeafletMapControl;
