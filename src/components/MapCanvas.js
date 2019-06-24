import React, { Component } from 'react';
import { Header } from 'semantic-ui-react';

import summary from '../apis/summary';

class MapCanvas extends Component {
  state = {
    geometry: {}
  };

  componentDidMount() {
    this.onViewChange();
  }

  async onViewChange() {
    const geoData = {
      geometry: this.state.geometry
    };
    const { data: result } = await summary.post('/sites', geoData);
    console.log(result);
  }

  render() {
    return <Header as="h1">MAP</Header>;
  }
}

export default MapCanvas;
