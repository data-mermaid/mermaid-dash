import React, { Component } from 'react';

import summary from '../apis/summary';
class MapCanvas extends Component {
  state = {
    geometry: {}
  };

  //here just test the onViewChange function for now
  componentDidMount() {
    this.onViewChange();
  }

  onViewChange = () => {
    const data = {
      geometry: this.state.geometry
    };

    summary.post('/sites', data).then(response => {
      //just inital set up, response will filter and return all geometry feature here.
      console.log(response);
    });
  };

  render() {
    return <div>MAP</div>;
  }
}

export default MapCanvas;
