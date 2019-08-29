import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import summary from '../src/apis/summary';
import './custom-leaflet.css';

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
      { title: 'Countries', count: null },
      { title: 'Projects', count: null },
      { title: 'Users', count: null },
      { title: 'Sites', count: null },
      { title: 'Transects', count: null },
      { title: 'Avg Coral Coverage', count: null }
    ],
    bbox: null,
    zoomFullMap: false,
    isLoading: false
  };

  async componentDidUpdate(prevProps, prevState) {
    const { bbox, metrics } = this.state;
    const { metrics: prevMetrics, bbox: prevBbox } = prevState;
    const prevMetricCountriesCount = prevMetrics[0].count;
    const prevMetricProjectsCount = prevMetrics[1].count;
    const prevMetricUsersCount = prevMetrics[2].count;
    const prevMetricSitesCount = prevMetrics[3].count;
    const prevMetricTransectsCount = prevMetrics[4].count;
    const prevMetricAvgCoralCoverCount = prevMetrics[5].count;

    if (bbox !== prevBbox) {
      const {
        data: { features: sites }
      } = await summary.get('sites/', {
        params: {
          limit: 1000,
          geometry: {
            type: 'MultiPolygon',
            coordinates: [[bbox]]
          }
        }
      });

      this.setState({ isLoading: false });
      if (prevMetricCountriesCount !== this.getCount(sites, 'country_name')) {
        metrics[0].count = this.getCount(sites, 'country_name');
        this.setState({ metrics });
      }
      if (prevMetricProjectsCount !== this.getCount(sites, 'project_id')) {
        metrics[1].count = this.getCount(sites, 'project_id');
        metrics[1].isLoading = false;
        this.setState({ metrics });
      }
      if (prevMetricUsersCount !== this.getCount(sites, 'project_admins')) {
        metrics[2].count = this.getCount(sites, 'project_admins');
        this.setState({ metrics });
      }
      if (prevMetricSitesCount !== sites.length) {
        metrics[3].count = sites.length;
        this.setState({ metrics });
      }
      if (prevMetricTransectsCount !== this.getTransectCount(sites, 'protocols')) {
        metrics[4].count = this.getTransectCount(sites, 'protocols');
        this.setState({ metrics });
      }
      if (prevMetricAvgCoralCoverCount !== this.getAvgCoralCount(sites, 'protocols')) {
        metrics[5].count = this.getAvgCoralCount(sites, 'protocols');
        this.setState({ metrics });
      }
    }
  }

  async componentDidMount() {
    const {
      data: { features: sites }
    } = await summary.get('/sites/?limit=1000');

    const { metrics } = this.state;
    metrics[0].count = this.getCount(sites, 'country_name');
    metrics[1].count = this.getCount(sites, 'project_id');
    metrics[2].count = this.getCount(sites, 'project_admins');
    metrics[3].count = sites.length;
    metrics[4].count = this.getTransectCount(sites, 'protocols');
    metrics[5].count = this.getAvgCoralCount(sites, 'protocols');
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

  getMapBounds = bbox => {
    this.setState({ bbox });
  };

  getCount(array, key) {
    let result = array.map(item => {
      return item.properties[key];
    });

    if (key === 'project_admins') {
      const tempResult = array.map(item => {
        return item.properties[key].map(secItem => {
          return secItem.name;
        });
      });
      result = [].concat.apply([], tempResult);
    }

    return new Set(result).size;
  }

  getTransectCount(array, key) {
    const protocols = array.map(item => {
      return item.properties[key];
    });
    const protocolCount = protocols
      .map(protocol => {
        const beltfishProtocol = protocol.beltfish;
        return beltfishProtocol ? beltfishProtocol.sample_unit_count : 0;
      })
      .reduce((acc, val) => acc + val, 0);

    return protocolCount;
  }

  getAvgCoralCount(array, key) {
    const protocols = array.map(item => {
      return item.properties[key];
    });

    const protocolCount = protocols
      .map(protocol => {
        const hasProtocols = Object.getOwnPropertyNames(protocol).length !== 0;
        if (hasProtocols && (protocol.benthiclit || protocol.benthicpit)) {
          const benthicProtocol = protocol.benthicpit ? protocol.benthicpit : protocol.benthiclit;
          const benthicCorals = benthicProtocol.coral_cover;
          const hardCoral = benthicCorals
            .map(coralItem => {
              return coralItem['Hard coral'] ? coralItem['Hard coral'] : 0;
            })
            .reduce((acc, val) => acc + val, 0);
          return hardCoral;
        } else {
          return 0;
        }
      })
      .reduce((acc, val) => acc + val, 0);

    return protocolCount.toFixed(0);
  }

  contentLoadHandler = option => {
    this.setState({ isLoading: option });
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
          contentLoadHandler={this.contentLoadHandler}
        />
        <DashBoard
          siteDetail={this.state.siteDetail}
          showSiteDetail={this.state.showSiteDetail}
          showFullMap={this.state.showFullMap}
          metrics={this.state.metrics}
          backButtonHandler={this.backButtonHandler}
          fullMapZoomHandler={this.fullMapZoomHandler}
          zoomAnimate={this.state.zoomAnimate}
          isLoading={this.state.isLoading}
        />
      </BrowserRouter>
    );
  }
}

export default App;
