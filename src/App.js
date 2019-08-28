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
      { title: 'Countries', count: null, isLoading: false },
      { title: 'Projects', count: null, isLoading: false },
      { title: 'Users', count: null, isLoading: false },
      { title: 'Sites', count: null, isLoading: false },
      { title: 'Transects', count: null, isLoading: false },
      { title: 'Avg Coral Coverage', count: null, isLoading: false }
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

    // if (bbox !== prevBbox) {
    //   console.log('bbox changes')
    //   this.contentLoadingHandler(true);
    // }

    // if (bbox !== prevBbox && prevMetricCountriesCount === this.getCount(sites, 'country_name')) {
    //   metrics[0].isLoading = false;
    //   this.setState({ metrics })
    // }

    // if (bbox !== prevBbox && prevMetricProjectsCount === this.getCount(sites, 'project_id')) {
    //   metrics[1].isLoading = false;
    //   this.setState({ metrics })
    // }

    // if (bbox !== prevBbox && prevMetricUsersCount === this.getCount(sites, 'project_admins')) {
    //   metrics[2].isLoading = false;
    //   this.setState({ metrics })
    // }

    // if (bbox !== prevBbox && prevMetricSitesCount === sites.length) {
    //   metrics[3].isLoading = false;
    //   this.setState({ metrics })
    // }

    // if (bbox !== prevBbox && prevMetricTransectsCount === this.getTransectCount(sites, 'protocols')) {
    //   metrics[4].isLoading = false;
    //   this.setState({ metrics })
    // }

    // if (bbox !== prevBbox && prevMetricAvgCoralCoverCount === this.getAvgCoralCount(sites, 'protocols')) {
    //   metrics[5].isLoading = false;
    //   this.setState({ metrics })
    // }

    if (prevMetricCountriesCount !== this.getCount(sites, 'country_name')) {
      metrics[0].count = this.getCount(sites, 'country_name');
      metrics[0].isLoading = false;
      this.setState({ metrics });
    }

    if (prevMetricProjectsCount !== this.getCount(sites, 'project_id')) {
      metrics[1].count = this.getCount(sites, 'project_id');
      metrics[1].isLoading = false;
      this.setState({ metrics });
    }

    if (prevMetricUsersCount !== this.getCount(sites, 'project_admins')) {
      metrics[2].count = this.getCount(sites, 'project_admins');
      metrics[2].isLoading = false;
      this.setState({ metrics });
    }

    if (prevMetricSitesCount !== sites.length) {
      metrics[3].count = sites.length;
      metrics[3].isLoading = false;
      this.setState({ metrics });
    }

    if (prevMetricTransectsCount !== this.getTransectCount(sites, 'protocols')) {
      metrics[4].count = this.getTransectCount(sites, 'protocols');
      metrics[4].isLoading = false;
      this.setState({ metrics });
    }

    if (prevMetricAvgCoralCoverCount !== this.getAvgCoralCount(sites, 'protocols')) {
      metrics[5].count = this.getAvgCoralCount(sites, 'protocols');
      metrics[5].isLoading = false;
      this.setState({ metrics });
    }
  }

  async componentDidMount() {
    const {
      data: { features: sites }
    } = await summary.get('/sites/?limit=1000'); //this filter bases on this sample project id for the front end

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

  // contentLoadingHandler(option) {
  //   const {metrics} = this.state;
  //   for (let i = 0; i < metrics.length; i++) {
  //     metrics[i].isLoading = option;
  //   }
  //   this.setState({ metrics })
  // }

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
          zoomAnimate={this.state.zoomAnimate}
        />
      </BrowserRouter>
    );
  }
}

export default App;
