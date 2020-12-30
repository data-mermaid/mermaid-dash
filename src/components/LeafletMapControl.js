import React from 'react';

import Box from '@material-ui/core/Box';
import makeStyles from '@material-ui/core/styles/makeStyles';
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

import FilterModal from './FilterModal';

const mapControlStyleProperty = makeStyles(theme => ({
  numberOfFilteredSitesWrapperProperty: {
    position: 'fixed',
    top: 242,
    width: 32,
    left: 11,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '0 0 4px 4px',
    fontSize: '80%',
    zIndex: 1000,
    backgroundColor: '#F4F4F4'
  },
  filterIconWrapperProperty: {
    position: 'fixed',
    top: 210,
    left: 11,
    zIndex: 1000
  },
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
  summaryStatisticsWrapperProperty: {
    position: 'fixed',
    top: 210,
    left: 11,
    zIndex: 1000
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
    zIndex: 1000,
    [theme.breakpoints.down('sm')]: {
      display: 'none'
    }
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

const LeafletMapControl = ({
  fullMapZoomHandler,
  zoomToSiteHandler,
  filterHandler,
  filterParams,
  filterChoices,
  showFilterNumbers,
  numberOfFilteredSites,
  isFilteringChoices,
  highlightMarker
}) => {
  const classes = mapControlStyleProperty();

  const fullMapToggle = (
    <ThemeProvider theme={theme.mapControl}>
      <ButtonStyle buttonBorder={true} setWiggle={true} onClick={() => fullMapZoomHandler(true)}>
        <Tooltip
          title="Zoom to Full"
          placement="right"
          TransitionComponent={Fade}
          TransitionProps={{ timeout: 200 }}
        >
          <ZoomOutIcon />
        </Tooltip>
      </ButtonStyle>
    </ThemeProvider>
  );

  const zoomToSelectSite = (
    <ThemeProvider theme={theme.mapControl}>
      <ButtonStyle
        buttonBorder={true}
        setWiggle={true}
        onClick={() => zoomToSiteHandler(true)}
        disabled={highlightMarker === null}
      >
        <Tooltip
          title="Zoom to Selected Site"
          placement="right"
          TransitionComponent={Fade}
          TransitionProps={{ timeout: 200 }}
        >
          <CurrentSelectLocationIcon />
        </Tooltip>
      </ButtonStyle>
    </ThemeProvider>
  );

  const fullMapControl = <Box className={classes.zoomOutIconWrapperProperty}>{fullMapToggle}</Box>;
  const zoomToControl = <Box className={classes.zoomToIconWrapperProperty}>{zoomToSelectSite}</Box>;
  const filterControl = (
    <Box className={classes.filterIconWrapperProperty}>
      <FilterModal
        filterHandler={filterHandler}
        filterParams={filterParams}
        filterChoices={filterChoices}
        showFilterNumbers={showFilterNumbers}
        isFilteringChoices={isFilteringChoices}
      />
    </Box>
  );
  const numberFiltered = showFilterNumbers && (
    <Box className={classes.numberOfFilteredSitesWrapperProperty}>{numberOfFilteredSites}</Box>
  );

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
      {filterControl}
      {numberFiltered}
      {mapLegend}
    </div>
  );
};

LeafletMapControl.propTypes = {
  fullMapZoomHandler: PropTypes.func,
  zoomToSiteHandler: PropTypes.func,
  classes: PropTypes.object
};

export default LeafletMapControl;
