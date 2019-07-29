import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components/macro';

import { theme, Header, DashBoard, LeafletMap } from './components';
import summary from '../src/apis/summary';
import 'mapbox-gl/dist/mapbox-gl.css';

class App extends Component {
  state = {
    showFullMap: true,
    showSiteDetail: false,
    sites: [],
    selectSite: null,
    siteDetail: null,
    metrics: [
      { title: 'Countries', count: 10 },
      { title: 'Projects', count: 2 },
      { title: 'Users', count: 20 },
      { title: 'Sites', count: null },
      { title: 'Transects', count: 5 },
      { title: 'Avg Coral Coverage', count: 12 }
    ],
    zoomFullMap: false
  };

  async componentDidMount() {
    const {
      data: { features: sites }
    } = await summary.post('/sites/'); //this filter bases on this sample project id for the front end
    const { metrics } = this.state;
    metrics[3].count = sites.length;

    this.setState({ sites: sites });
    this.setState({ metrics });
  }

  toggle = () => {
    this.setState({ showFullMap: !this.state.showFullMap });
  };

  siteSelectHandler = selectedOption => {
    this.setState({ selectSite: selectedOption });
  };

  siteClickHandler = selectedSite => {
    this.setState({ siteDetail: selectedSite, showSiteDetail: true, zoomFullMap: false });
  };

  backButtonHandler = () => {
    this.setState({ showSiteDetail: false, zoomFullMap: false });
  };

  fullMapZoomHandler = () => {
    this.setState({ zoomFullMap: true });
  };

  render() {
    return (
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <>
            <Header toggle={this.toggle} showFullMap={this.state.showFullMap} />
            <LeafletMap
              markersData={this.state.sites}
              siteClickHandler={this.siteClickHandler}
              zoomFullMap={this.state.zoomFullMap}
            />
            <DashBoard
              siteDetail={this.state.siteDetail}
              showSiteDetail={this.state.showSiteDetail}
              showFullMap={this.state.showFullMap}
              metrics={this.state.metrics}
              backButtonHandler={this.backButtonHandler}
              fullMapZoomHandler={this.fullMapZoomHandler}
            />
          </>
        </ThemeProvider>
      </BrowserRouter>
    );
  }
}

export default App;
