import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import summary from '../src/apis/summary';
import './customStyles.css';
import * as leafletProperty from './leaflet_property';

import Header from './components/Header';
import DashBoard from './components/DashBoard';
import LeafletMap from './components/LeafletMap';

class App extends Component {
  state = {
    showFullMap: true,
    showSiteDetail: false,
    showDropDown: false,
    sites: [],
    siteDetail: null,
    siteDropDownData: [],
    metrics: [
      { title: 'Countries', count: null },
      { title: 'Projects', count: null },
      { title: 'Users', count: null },
      { title: 'Sites', count: null },
      { title: 'Transects', count: null },
      { title: 'Avg Coral Coverage', count: null }
    ],
    histogram: [
      { x: 0.05, y: 0, label: 0 },
      { x: 0.1, y: 0, label: 0 },
      { x: 0.15, y: 0, label: 0 },
      { x: 0.2, y: 0, label: 0 },
      { x: 0.25, y: 0, label: 0 },
      { x: 0.3, y: 0, label: 0 },
      { x: 0.35, y: 0, label: 0 },
      { x: 0.4, y: 0, label: 0 },
      { x: 0.45, y: 0, label: 0 },
      { x: 0.5, y: 0, label: 0 },
      { x: 0.55, y: 0, label: 0 },
      { x: 0.6, y: 0, label: 0 },
      { x: 0.65, y: 0, label: 0 },
      { x: 0.7, y: 0, label: 0 },
      { x: 0.75, y: 0, label: 0 },
      { x: 0.8, y: 0, label: 0 },
      { x: 0.85, y: 0, label: 0 },
      { x: 0.9, y: 0, label: 0 },
      { x: 0.95, y: 0, label: 0 },
      { x: 1, y: 0, label: 0 }
    ],
    bbox: null,
    zoomFullMap: false,
    highlightMarker: null,
    isLoading: false
  };

  async componentDidUpdate(prevProps, prevState) {
    const { bbox, metrics, histogram } = this.state;
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

      const barchartResult = this.histogramCount(sites, histogram);
      for (let i = 0; i < barchartResult.length; i++) {
        histogram[i].y = barchartResult[i];
        histogram[i].label = barchartResult[i];
      }
      this.setState({ histogram });
    }
  }

  async componentDidMount() {
    const {
      data: { features: sites }
    } = await summary.get('/sites/?limit=1000');

    const { metrics, histogram } = this.state;
    const barchartResult = this.histogramCount(sites, histogram);

    metrics[0].count = this.getCount(sites, 'country_name');
    metrics[1].count = this.getCount(sites, 'project_id');
    metrics[2].count = this.getCount(sites, 'project_admins');
    metrics[3].count = sites.length;
    metrics[4].count = this.getTransectCount(sites, 'protocols');
    metrics[5].count = this.getAvgCoralCount(sites, 'protocols');

    for (let i = 0; i < barchartResult.length; i++) {
      histogram[i].y = barchartResult[i];
      histogram[i].label = barchartResult[i];
    }

    this.setState({ histogram });
    this.setState({ sites });
    this.setState({ metrics });
  }

  toggle = () => {
    this.setState({ showFullMap: !this.state.showFullMap, zoomFullMap: false });
  };

  siteClickHandler = selectedSite => {
    if (selectedSite.key) {
      selectedSite = this.siteLookup(selectedSite);
    }
    this.setState({ siteDetail: selectedSite, showSiteDetail: true, zoomFullMap: false });
  };

  siteDropDownHandler = selectedSites => {
    this.setState({
      siteDetail: selectedSites[0],
      siteDropDownData: selectedSites,
      showSiteDetail: true,
      showDropDown: true,
      zoomFullMap: false
    });
  };

  sitesDropDownToggle = option => {
    this.setState({ showDropDown: option });
  };

  backButtonHandler = () => {
    const { highlightMarker } = this.state;
    if (highlightMarker !== null) {
      highlightMarker.setIcon(leafletProperty.icon);
      this.setState({ highlightMarker: null });
    }
    this.setState({ showSiteDetail: false, zoomFullMap: false });
  };

  fullMapZoomHandler = zoomOffOption => {
    const zoomFullMap = zoomOffOption ? true : false;
    this.setState({ zoomFullMap });
  };

  removeHighlight = () => {
    const { highlightMarker } = this.state;
    if (highlightMarker !== null) {
      highlightMarker.setIcon(leafletProperty.icon);
      this.setState({ highlightMarker: null });
    }
  };

  setIconActive = marker => {
    marker.setIcon(leafletProperty.activeIcon);
    this.setState({ highlightMarker: marker });
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

  getHardCoralValue(benthiclit, benthicpit) {
    let hardCoralValue;

    if (benthicpit && benthiclit) {
      const benthicpitCoralCover = benthicpit.coral_cover;
      const benthiclitCoralCover = benthiclit.coral_cover;
      const benthicpitHardCoral = benthicpitCoralCover
        .map(coralItem => {
          return coralItem['Hard coral'] ? coralItem['Hard coral'] : 0;
        })
        .reduce((acc, val) => acc + val, 0);
      const benthiclitHardCoral = benthiclitCoralCover
        .map(coralItem => {
          return coralItem['Hard coral'] ? coralItem['Hard coral'] : 0;
        })
        .reduce((acc, val) => acc + val, 0);
      hardCoralValue = (benthicpitHardCoral + benthiclitHardCoral) / 2;
    } else {
      const benthicCoralCover = benthicpit ? benthicpit.coral_cover : benthiclit.coral_cover;
      hardCoralValue = benthicCoralCover
        .map(coralItem => {
          return coralItem['Hard coral'] ? coralItem['Hard coral'] : 0;
        })
        .reduce((acc, val) => acc + val, 0);
    }
    return hardCoralValue;
  }

  getAvgCoralCount(array, key) {
    const protocols = array.map(item => {
      return item.properties[key];
    });

    const protocolCount = protocols.map(protocol => {
      const hasProtocols = Object.getOwnPropertyNames(protocol).length !== 0;
      const result =
        hasProtocols && (protocol.benthiclit || protocol.benthicpit)
          ? this.getHardCoralValue(protocol.benthiclit, protocol.benthicpit)
          : 0;
      return result;
    });
    const sumOfCoralCover = protocolCount.reduce((acc, val) => acc + val, 0);
    const avgCoralCover = sumOfCoralCover
      ? (sumOfCoralCover / protocolCount.length) * 100
      : sumOfCoralCover;
    return avgCoralCover.toFixed(0);
  }

  histogramCount(array, histogramData) {
    const histogramArr = histogramData.map(data => {
      return data.x;
    });

    const protocols = array.map(item => {
      return item.properties.protocols;
    });

    const protocolArr = protocols.map(protocol => {
      const hasProtocols = Object.getOwnPropertyNames(protocol).length !== 0;
      const result =
        hasProtocols && (protocol.benthiclit || protocol.benthicpit)
          ? this.getHardCoralValue(protocol.benthiclit, protocol.benthicpit)
          : null;
      return result;
    });

    const histogramResult = histogramArr.map(item => {
      let count = 0;
      for (let i = 0; i < protocolArr.length; i++) {
        const calDiff = item - protocolArr[i];
        if (protocolArr[i] !== null && (0 <= calDiff && calDiff < 0.05)) {
          count += 1;
        }
      }
      return count;
    });

    return histogramResult;
  }

  contentLoadHandler = option => {
    this.setState({ isLoading: option });
  };

  siteLookup({ key: siteId }) {
    const { sites } = this.state;
    return sites.filter(site => site.id === siteId)[0];
  }

  render() {
    return (
      <BrowserRouter>
        <Header toggle={this.toggle} showFullMap={this.state.showFullMap} />
        <LeafletMap
          markersData={this.state.sites}
          siteClickHandler={this.siteClickHandler}
          siteDropDownHandler={this.siteDropDownHandler}
          sitesDropDownToggle={this.sitesDropDownToggle}
          zoomFullMap={this.state.zoomFullMap}
          fullMapZoomHandler={this.fullMapZoomHandler}
          getMapBounds={this.getMapBounds}
          getRawBBox={this.getRawBBox}
          bbox={this.state.bbox}
          contentLoadHandler={this.contentLoadHandler}
          removeHighlight={this.removeHighlight}
          setIconActive={this.setIconActive}
          highlightMarker={this.state.highlightMarker}
        />
        <DashBoard
          siteDetail={this.state.siteDetail}
          siteDropDownData={this.state.siteDropDownData}
          siteClickHandler={this.siteClickHandler}
          showSiteDetail={this.state.showSiteDetail}
          showFullMap={this.state.showFullMap}
          showDropDown={this.state.showDropDown}
          metrics={this.state.metrics}
          histogram={this.state.histogram}
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
