import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';

import Header from './components/Header';
import MapCanvas from './components/MapCanvas';
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
        <div>
          <Header toggle={this.toggle} />
          <MapCanvas />
          <DashBoard showFullMap={this.state.show} />
        </div>
      </BrowserRouter>
    );
  }
}
export default App;
