import React, { Component } from 'react';
import mapboxgl from 'mapbox-gl';
import styled from 'styled-components/macro';
import PropTypes from 'prop-types';

import Minimap from '../helpers/mapboxgl-control-minimap';
mapboxgl.Minimap = Minimap;

const MapContainer = styled('section')`
  height: calc(100vh - ${props => props.theme.headerHeight});
`;

class Map extends Component {
  constructor(props) {
    super(props);
    const { lat, lng, zoom } = this.props;
    this.state = {
      lng,
      lat,
      zoom
    };
  }

  componentDidMount() {
    const { lng, lat, zoom } = this.state;
    const { accessToken } = this.props;
    mapboxgl.accessToken = accessToken;
    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/satellite-v9',
      center: [lng, lat],
      zoom
    });

    map.on('move', () => {
      const { lng, lat } = map.getCenter();
      this.setState({
        lng: lng.toFixed(4),
        lat: lat.toFixed(4),
        zoom: map.getZoom().toFixed(2)
      });
    });

    map.on('style.load', function() {
      // Possible position values are 'bottom-left', 'bottom-right', 'top-left', 'top-right'
      map.addControl(
        new mapboxgl.Minimap({
          id: 'mapboxgl-minimap',
          width: '260px',
          height: '150px',
          style: 'mapbox://styles/mapbox/light-v10',
          center: [50, 30],
          zoom: 0,
          lineColor: '#91181A',
          lineWidth: 1,
          lineOpacity: 1,

          fillColor: '#91181A',
          fillOpacity: 0.5,

          dragPan: true
        }),
        'bottom-left'
      );
    });
  }
  render() {
    const style = {
      position: 'absolute',
      top: 64,
      bottom: 0,
      width: '100%',
      height: 'calc(100vh - 64px)'
    };
    return <MapContainer style={style} ref={el => (this.mapContainer = el)} />;
  }
}

Map.propTypes = {
  accessToken: PropTypes.string.isRequired,
  lat: PropTypes.number,
  lng: PropTypes.number,
  zoom: PropTypes.number
};

Map.defaultProps = {
  lat: -12.287,
  lng: 113.278,
  zoom: 5
};

export default Map;
