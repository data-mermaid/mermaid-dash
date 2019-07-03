import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import 'mapbox-gl/dist/mapbox-gl.css';

import Header from './components/Header';
import DashBoard from './components/DashBoard';

class App extends Component {
  state = {
    show: true
  };

  toggle = () => {
    this.setState({ show: !this.state.show });
  };

  render() {
    return (
      <BrowserRouter>
        <Header toggle={this.toggle} />
        <DashBoard showFullMap={this.state.show} />
      </BrowserRouter>
    );
  }
}

export default App;
