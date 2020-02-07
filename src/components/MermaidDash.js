import React, { Component } from 'react';

import summary from '../apis/summary';
import choices from '../apis/choices';
import '../customStyles.css';
import * as leafletProperty from '../constants/leaflet-properties';
import CssBaseline from '@material-ui/core/CssBaseline';

import Header from './Header';
import DrawerDashBoard from './DrawerDashBoard';
import LeafletMap from './LeafletMap';
import LeafletMapControl from './LeafletMapControl';
import BottomSummaryPanel from './BottomSummaryPanel';

class MermaidDash extends Component {
  state = {
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
    zoomToSite: false,
    highlightMarker: null,
    highlightCluster: null,
    isLoading: false,
    sidePanelOpen: window.innerWidth >= 960,
    popupOpen: false,
    mobileDisplay: window.innerWidth < 960,
    dragPanelPosition: { x: 0, y: -175 },
    filterParams: { country_name: [], project_id: [] },
    filterChoices: { countries: [], projects: [] }
  };

  async componentDidUpdate(prevProps, prevState) {
    const {
      bbox,
      metrics,
      histogram,
      filterParams: { country_name: countryName, project_id: projectId }
    } = this.state;
    const {
      metrics: prevMetrics,
      bbox: prevBbox,
      filterParams: { country_name: prevCountryName, project_id: prevProjectId }
    } = prevState;

    const prevMetricCountriesCount = prevMetrics[0].count;
    const prevMetricProjectsCount = prevMetrics[1].count;
    const prevMetricUsersCount = prevMetrics[2].count;
    const prevMetricSitesCount = prevMetrics[3].count;
    const prevMetricTransectsCount = prevMetrics[4].count;
    const prevMetricAvgCoralCoverCount = prevMetrics[5].count;

    if (countryName !== prevCountryName || projectId !== prevProjectId) {
      this.filterUpdate();
    }

    if (bbox !== prevBbox) {
      const {
        data: { features: sites }
      } = await summary.get('sites/', {
        params: {
          limit: 1000,
          country_name: countryName.join(','),
          project_id: projectId.join(','),
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
    const { metrics, histogram, filterParams, filterChoices } = this.state;
    const params = new URLSearchParams(this.props.location.search);
    const countryName = params.get('country_name');
    const projectId = params.get('project_id');
    const paramsObj = {
      limit: 1000,
      country_name: countryName,
      project_id: projectId
    };

    const {
      data: { features: sites }
    } = await summary.get('/sites/', {
      params: paramsObj
    });

    const {
      data: { results: projects }
    } = await choices.get('/projects/?showall&limit=1000');

    const { data: choices_data } = await choices.get('/choices');
    const country_list = this.fetchChoices('countries', choices_data);

    filterChoices.countries = country_list;
    filterChoices.projects = projects;
    const barchartResult = this.histogramCount(sites, histogram);

    metrics[0].count = this.getCount(sites, 'country_name');
    metrics[1].count = this.getCount(sites, 'project_id');
    metrics[2].count = this.getCount(sites, 'project_admins');
    metrics[3].count = sites.length;
    metrics[4].count = this.getTransectCount(sites, 'protocols');
    metrics[5].count = this.getAvgCoralCount(sites, 'protocols');

    if (countryName) {
      filterParams.country_name = countryName.split(',');
    }

    if (projectId) {
      filterParams.project_id = projectId.split(',');
    }

    for (let i = 0; i < barchartResult.length; i++) {
      histogram[i].y = barchartResult[i];
      histogram[i].label = barchartResult[i];
    }

    this.setState({ histogram, sites, metrics, filterParams, filterChoices });
    window.addEventListener('resize', this.resize.bind(this));
    this.resize();
  }

  resize() {
    let currentMobileDisplay = window.innerWidth < 960;
    if (currentMobileDisplay !== this.state.mobileDisplay) {
      this.setState({ mobileDisplay: currentMobileDisplay, sidePanelOpen: !currentMobileDisplay });
    }
  }

  handleDrawerChange = () => {
    this.setState({ sidePanelOpen: !this.state.sidePanelOpen });
  };

  siteClickHandler = selectedSite => {
    const { highlightCluster, siteDropDownData, sidePanelOpen, mobileDisplay } = this.state;
    const siteDropdownList = siteDropDownData.map(site => site.id);
    selectedSite = selectedSite.key ? this.siteLookup(selectedSite) : selectedSite;
    const siteExistsInCluster = siteDropdownList.find(site => site === selectedSite.id)
      ? true
      : false;

    if (highlightCluster !== null && !siteExistsInCluster) {
      highlightCluster.clearLayers();
      this.setState({ highlightCluster: null, popupOpen: true });
    } else if (highlightCluster !== null && siteExistsInCluster) {
      this.setState({ popupOpen: true });
    } else if (highlightCluster === null) {
      this.setState({ popupOpen: false });
    }

    if (!mobileDisplay && !sidePanelOpen) {
      this.setState({ sidePanelOpen: true });
    }

    this.setState({
      siteDetail: selectedSite,
      showSiteDetail: true,
      zoomFullMap: false,
      dragPanelPosition: { x: 0, y: -70 }
    });
  };

  siteDropDownHandler = selectedSites => {
    const { sidePanelOpen, mobileDisplay } = this.state;

    if (!(mobileDisplay || sidePanelOpen)) {
      this.setState({ sidePanelOpen: true });
    }

    this.setState({
      siteDetail: selectedSites[0],
      siteDropDownData: selectedSites,
      popupOpen: true,
      showSiteDetail: true,
      showDropDown: true,
      zoomFullMap: false,
      dragPanelPosition: { x: 0, y: -70 }
    });
  };

  sitesDropDownToggle = option => {
    this.setState({ showDropDown: option });
  };

  clearSelectedSiteHandler = () => {
    const { highlightMarker, highlightCluster } = this.state;
    if (highlightMarker !== null) {
      highlightMarker.setIcon(leafletProperty.icon);
      this.setState({ highlightMarker: null });
    }
    if (highlightCluster !== null) {
      highlightCluster.clearLayers();
      this.setState({ highlightCluster: null });
    }
    this.setState({
      showSiteDetail: false,
      zoomFullMap: false,
      siteDetail: null,
      popupOpen: false,
      dragPanelPosition: { x: 0, y: -175 }
    });
  };

  fullMapZoomHandler = zoomOffOption => {
    const zoomFullMap = zoomOffOption ? true : false;
    this.setState({ zoomFullMap });
  };

  zoomToSiteHandler = zoomToOption => {
    const zoomToSite = zoomToOption ? true : false;
    this.setState({ zoomToSite });
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

  removeHighlightCluster = () => {
    const { highlightCluster } = this.state;
    if (highlightCluster !== null) {
      highlightCluster.clearLayers();
      this.setState({ highlightCluster: null });
    }
  };

  setClusterActive = clusterMarker => {
    this.setState({ highlightCluster: clusterMarker });
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
      hardCoralValue =
        benthicCoralCover !== undefined &&
        benthicCoralCover
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
        hasProtocols &&
        (protocol.benthiclit || protocol.benthicpit) &&
        this.getHardCoralValue(protocol.benthiclit, protocol.benthicpit);
      return result;
    });

    const filteredProtocol = protocolCount.filter(val => val !== undefined);

    const sumOfCoralCover = filteredProtocol.reduce((acc, val) => acc + val, 0);
    const avgCoralCover = sumOfCoralCover
      ? (sumOfCoralCover / filteredProtocol.length) * 100
      : sumOfCoralCover;

    return Math.round(avgCoralCover);
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
        const calDiff = parseFloat((item - protocolArr[i]).toFixed(3));

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

  filterHandler = params => {
    const newParams = { ...this.state.filterParams };
    newParams.country_name = params.country_name;
    newParams.project_id = params.project_id;
    this.setState({ filterParams: newParams });
  };

  filterUpdate = () => {
    const queryStrings = [];
    const countryProperty = Object.entries(this.state.filterParams)[0];
    const projectIdProperty = Object.entries(this.state.filterParams)[1];

    if (countryProperty[1].length > 0) {
      const countryQueryStrings = [countryProperty[0], countryProperty[1].join(',')].join('=');
      queryStrings.push(countryQueryStrings);
    }

    if (projectIdProperty[1].length > 0) {
      const projectIdQueryStrings = [projectIdProperty[0], projectIdProperty[1].join(',')].join(
        '='
      );
      queryStrings.push(projectIdQueryStrings);
    }

    this.props.history.push({
      pathname: '/',
      search: '?' + queryStrings.join('&')
    });

    window.location.reload();
  };

  fetchChoices = (choice_name, choices) => {
    return choices
      .reduce((newArray, obj) => {
        if (obj.name === choice_name) {
          newArray = obj.data;
        }
        return newArray;
      }, [])
      .map(val => {
        return { id: val.id, name: val.name };
      });
  };

  render() {
    return (
      <>
        <CssBaseline />
        <Header />
        <DrawerDashBoard
          sidePanelOpen={this.state.sidePanelOpen}
          handleDrawerChange={this.handleDrawerChange}
          siteDetail={this.state.siteDetail}
          showSiteDetail={this.state.showSiteDetail}
          metrics={this.state.metrics}
          histogramContent={this.state.histogram}
          clearSelectedSiteHandler={this.clearSelectedSiteHandler}
          fullMapZoomHandler={this.fullMapZoomHandler}
          zoomToSiteHandler={this.zoomToSiteHandler}
          isLoading={this.state.isLoading}
          hideDrawer={this.state.mobileDisplay}
        />
        <LeafletMapControl
          fullMapZoomHandler={this.fullMapZoomHandler}
          zoomToSiteHandler={this.zoomToSiteHandler}
          filterHandler={this.filterHandler}
          filterParams={this.state.filterParams}
          filterChoices={this.state.filterChoices}
        />
        <LeafletMap
          sidePanelOpen={this.state.sidePanelOpen}
          markersData={this.state.sites}
          siteDetail={this.state.siteDetail}
          siteClickHandler={this.siteClickHandler}
          siteDropDownHandler={this.siteDropDownHandler}
          sitesDropDownToggle={this.sitesDropDownToggle}
          zoomFullMap={this.state.zoomFullMap}
          fullMapZoomHandler={this.fullMapZoomHandler}
          zoomToSite={this.state.zoomToSite}
          zoomToSiteHandler={this.zoomToSiteHandler}
          getMapBounds={this.getMapBounds}
          bbox={this.state.bbox}
          contentLoadHandler={this.contentLoadHandler}
          removeHighlight={this.removeHighlight}
          setIconActive={this.setIconActive}
          removeHighlightCluster={this.removeHighlightCluster}
          setClusterActive={this.setClusterActive}
          highlightMarker={this.state.highlightMarker}
          popupOpen={this.state.popupOpen}
          hideMiniMap={this.state.mobileDisplay}
        />
        {this.state.mobileDisplay && (
          <BottomSummaryPanel
            metrics={this.state.metrics}
            isLoading={this.state.isLoading}
            histogramContent={this.state.histogram}
            siteDetail={this.state.siteDetail}
            showSiteDetail={this.state.showSiteDetail}
            clearSelectedSiteHandler={this.clearSelectedSiteHandler}
          />
        )}
      </>
    );
  }
}

export default MermaidDash;
