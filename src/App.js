import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import summary from '../src/apis/summary';
import 'mapbox-gl/dist/mapbox-gl.css';

import Header from './components/Header';
import DashBoard from './components/DashBoard';
import LeafletMap from './components/LeafletMap';

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
    bbox: null,
    zoomFullMap: false
  };

  componentDidUpdate(prevProps, prevState) {}

  async componentDidMount() {
    const {
      data: { features: sites }
    } = await summary.get('/sites/?limit=1000'); //this filter bases on this sample project id for the front end
    const { metrics } = this.state;
    metrics[3].count = sites.length;

    this.setState({ sites });
    this.setState({ metrics });
  }

  toggle = () => {
    this.setState({ showFullMap: !this.state.showFullMap, zoomFullMap: false });
  };

  siteClickHandler = selectedSite => {
    this.setState({ siteDetail: selectedSite, showSiteDetail: true, zoomFullMap: false });
  };

  backButtonHandler = () => {
    this.setState({ showSiteDetail: false, zoomFullMap: false });
  };

  fullMapZoomHandler = zoomOffOption => {
    const zoomFullMap = zoomOffOption ? true : false;
    this.setState({ zoomFullMap });
  };

  getMapBounds = newBox => {
    this.setState({ bbox: newBox });
  };

  getRawBBox = rawBox => {
    this.setState({ bboxRaw: rawBox });
  };

  render() {
    return (
      <BrowserRouter>
        <Header toggle={this.toggle} showFullMap={this.state.showFullMap} />
        <LeafletMap
          markersData={this.state.sites}
          siteClickHandler={this.siteClickHandler}
          zoomFullMap={this.state.zoomFullMap}
          fullMapZoomHandler={this.fullMapZoomHandler}
          getMapBounds={this.getMapBounds}
          getRawBBox={this.getRawBBox}
          bbox={this.state.bbox}
          bboxRaw={this.state.bboxRaw}
        />
        <DashBoard
          siteDetail={this.state.siteDetail}
          showSiteDetail={this.state.showSiteDetail}
          showFullMap={this.state.showFullMap}
          metrics={this.state.metrics}
          backButtonHandler={this.backButtonHandler}
          fullMapZoomHandler={this.fullMapZoomHandler}
        />
      </BrowserRouter>
    );
  }
}

export default App;
