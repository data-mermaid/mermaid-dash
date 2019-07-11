import React, { Component } from 'react';
import ReactMapGL, { Marker } from 'react-map-gl';
import styled from 'styled-components/macro';
import LocationIcon from '@material-ui/icons/Lens';

const MapWrapper = styled('div')`
  position: absolute;
`;

class MapCanvas extends Component {
  state = {
    viewport: {
      width: '100vw',
      height: 'calc(100vh - 64px)',
      latitude: -12.287,
      longitude: 113.278,
      zoom: 3
    }
  };

  render() {
    const { geoObject } = this.props;

    const siteLocations = geoObject
      ? geoObject.map(site => (
          <Marker
            key={site.id}
            latitude={site.geometry.coordinates[1]}
            longitude={site.geometry.coordinates[0]}
          >
            <LocationIcon color="secondary" />
          </Marker>
        ))
      : null;

    return (
      <MapWrapper>
        <ReactMapGL
          {...this.state.viewport}
          mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
          mapStyle="mapbox://styles/mapbox/satellite-v9"
          onViewportChange={viewport => this.setState({ viewport })}
        >
          {siteLocations}
        </ReactMapGL>
      </MapWrapper>
    );
  }
}

export default MapCanvas;
