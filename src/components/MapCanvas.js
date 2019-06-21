import React, { Component } from 'react';
import ReactMapGL, { Marker } from 'react-map-gl';
import { Icon } from 'semantic-ui-react';

import summary from '../apis/summary';
import './MapCanvas.css';

const MAPBOX_TOKEN =
  'pk.eyJ1Ijoibmlja2hvYW5nIiwiYSI6ImNqeDB3NzNzbjAzamg0Ym83aXZmcWEzbDcifQ.hvWWVoMPsWS2KVa8nFfOkA';

class MapCanvas extends Component {
  state = {
    geometry: {},
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
    const geoData = {
      geometry: this.state.geometry
    };
    const { data: result } = await summary.post('/sites', geoData);
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
          <Icon name="circle" color="red" />
        </Marker>
      ))
    ) : (
      <div>NOT FOUND</div>
    );

    return (
      <div className="MapOverlay">
        <ReactMapGL
          {...this.state.viewport}
          mapboxApiAccessToken={MAPBOX_TOKEN}
          mapStyle="mapbox://styles/nickhoang/cjx6prmf703ev1cqz9qd1ykdr"
          onViewportChange={viewport => this.setState({ viewport })}
        >
          {siteLocations}
        </ReactMapGL>
      </div>
    );
  }
}

export default MapCanvas;
