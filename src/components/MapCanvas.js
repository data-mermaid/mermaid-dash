import React, { Component } from 'react';
import ReactMapGL, { Marker } from 'react-map-gl';
import styled from 'styled-components/macro';
import LocationIcon from '@material-ui/icons/Lens';

import summary from '../apis/summary';

const MapWrapper = styled('div')`
  position: absolute;
`;

class MapCanvas extends Component {
  state = {
    viewport: {
      width: '100vw',
      height: '100vh',
      latitude: -12.287,
      longitude: 113.278,
      zoom: 3
    },
    geoObject: null
  };

  componentDidMount() {
    this.onViewChange();
  }

  async onViewChange() {
    const { data: result } = await summary.post('/sites/');
    this.setState({ geoObject: result });
  }

  render() {
    const siteLocations = this.state.geoObject ? (
      this.state.geoObject.features.map(site => (
        <Marker
          key={site.id}
          latitude={site.geometry.coordinates[1]}
          longitude={site.geometry.coordinates[0]}
        >
          <LocationIcon color="secondary" />
        </Marker>
      ))
    ) : (
      <div>NOT FOUND</div>
    );

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
