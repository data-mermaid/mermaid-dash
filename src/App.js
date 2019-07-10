import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import 'mapbox-gl/dist/mapbox-gl.css';

import Header from './components/Header';
import DashBoard from './components/DashBoard';
import MapCanvas from './components/MapCanvas';

class App extends Component {
  state = {
    showFullMap: true
  };

  toggle = () => {
    this.setState({ showFullMap: !this.state.showFullMap });
  };

  render() {
    return (
      <BrowserRouter>
        <Header toggle={this.toggle} />
        <MapCanvas />
        <DashBoard showFullMap={this.state.showFullMap} />
      </BrowserRouter>
    );
  }
}

export default App;
