import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import Header from './components/Header';
import MapCanvas from './components/MapCanvas';
import SiteList from './components/SiteList';
import SiteDetail from './components/SiteDetail';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Header />
        <MapCanvas />
        <Route path="/" exact component={SiteList} />
        <Route path="/:id" component={SiteDetail} />
      </BrowserRouter>
    );
  }
}

export default App;
