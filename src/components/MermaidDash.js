import React, { Component } from 'react';
import { histogramContext } from '../context/histogramContext';

import summary from '../apis/summary';
import '../customStyles.css';
import * as leafletProperty from '../constants/leaflet-properties';
import CssBaseline from '@material-ui/core/CssBaseline';

import Header from './Header';
import DrawerDashBoard from './DrawerDashBoard';
import LeafletMap from './LeafletMap';
import LeafletMapControl from './LeafletMapControl';
import BottomSummaryPanel from './BottomSummaryPanel';

class MermaidDash extends Component {
  static contextType = histogramContext;

  state = {
    showSiteDetail: false,
    sites: [],
    siteDetail: null,
    popupSiteList: [],
    metrics: [
      { title: 'Countries', count: null },
      { title: 'Projects', count: null },
      { title: 'People', count: null },
      { title: 'Sites', count: null },
      { title: 'Transects', count: null },
      { title: 'Avg Coral Coverage', count: null }
    ],
    bbox: null,
    zoomFullMap: false,
    zoomToSite: false,
    highlightMarker: null,
    highlightCluster: null,
    isLoading: false,
    isFiltering: true,
    isFilteringChoices: true,
    sidePanelOpen: window.innerWidth >= 960,
    popupOpen: false,
    mobileDisplay: window.innerWidth < 960,
    dragPanelPosition: { x: 0, y: -175 },
    filterParams: {
      country: [],
      project: [],
      organization: [],
      date_min_after: '',
      date_max_before: ''
    },
    filterChoices: { countries: [], projects: [], tags: [] },
    showFilterNumbers: false,
    queryLimit: 1000
  };

  componentDidUpdate(prevProps, prevState) {
    const {
      sites,
      bbox,
      metrics,
      filterChoices: { projects: projectChoices },
      filterParams: {
        country: countryName,
        project: projectId,
        organization: organizationId,
        date_min_after: dateMin,
        date_max_before: dateMax
      },
      isFiltering
    } = this.state;

    const { histogram } = this.context;

    const {
      metrics: prevMetrics,
      bbox: prevBbox,
      filterParams: {
        country: prevCountryName,
        project: prevProjectId,
        organization: prevOrganizationId,
        date_min_after: prevDateMin,
        date_max_before: prevDateMax
      }
    } = prevState;

    const prevMetricCountriesCount = prevMetrics[0].count;
    const prevMetricProjectsCount = prevMetrics[1].count;
    const prevMetricUsersCount = prevMetrics[2].count;
    const prevMetricSitesCount = prevMetrics[3].count;
    const prevMetricTransectsCount = prevMetrics[4].count;
    const prevMetricAvgCoralCoverCount = prevMetrics[5].count;

    if (
      countryName !== prevCountryName ||
      projectId !== prevProjectId ||
      organizationId !== prevOrganizationId ||
      dateMin !== prevDateMin ||
      dateMax !== prevDateMax
    ) {
      this.filterUpdate();
    }

    if (bbox !== prevBbox && !isFiltering) {
      const updatedSites = this.filterSites(sites, bbox);
      const updatedSiteProtocols = updatedSites.map(({ protocols }) => protocols);
      this.context.setHistogram(this.histogramCount(updatedSiteProtocols, histogram));

      const countryCount = this.getCount(updatedSites, 'country_id');
      const projectCount = this.getCount(updatedSites, 'project_id');
      const userCount = this.getUserCount(updatedSites, projectChoices);
      const uniqueSiteCount = this.getUniqueSiteCount(updatedSites);
      const transectCount = this.getTransectCount(updatedSites);
      const avgCoralCoverCount = this.getAvgCoralCount(updatedSiteProtocols);

      if (prevMetricCountriesCount !== countryCount) metrics[0].count = countryCount;
      if (prevMetricProjectsCount !== projectCount) metrics[1].count = projectCount;
      if (prevMetricUsersCount !== userCount) metrics[2].count = userCount;
      if (prevMetricSitesCount !== uniqueSiteCount) metrics[3].count = uniqueSiteCount;
      if (prevMetricTransectsCount !== transectCount) metrics[4].count = transectCount;
      if (prevMetricAvgCoralCoverCount !== avgCoralCoverCount)
        metrics[5].count = avgCoralCoverCount;

      this.setState({ metrics, isLoading: false });
    }
  }

  componentDidMount() {
    const { filterParams, queryLimit } = this.state;

    const params = new URLSearchParams(this.props.location.search);
    const countryName = params.get('country');
    const projectId = params.get('project');
    const organizationId = params.get('organization');
    const date = params.get('date');
    const dateMinMax = date ? date.split(',') : [];
    const dateMin = dateMinMax[0] && `${dateMinMax[0]}-01-01`;
    const dateMax = dateMinMax[1] && `${dateMinMax[1]}-12-31`;
    const queryStringsFound =
      countryName || projectId || organizationId || dateMinMax.length > 0 ? true : false;

    const paramsObj = {
      limit: queryLimit,
      country_name: countryName,
      project_id: projectId,
      tag_id: organizationId,
      date_min_after: dateMin,
      date_max_before: dateMax
    };
    this.fetchAllSites(paramsObj);

    if (countryName) filterParams.country = countryName.split(',');

    if (projectId) filterParams.project = projectId.split(/,(?=\S)|:/);

    if (organizationId) filterParams.organization = organizationId.split(/,(?=\S)|:/);

    if (dateMin) filterParams.date_min_after = dateMin.split('-')[0];

    if (dateMax) filterParams.date_max_before = dateMax.split('-')[0];

    this.setState({
      filterParams,
      showFilterNumbers: queryStringsFound
    });

    window.addEventListener('resize', this.resize.bind(this));
    this.resize();
  }

  convertToId = (names, filtered_options) => {
    return filtered_options
      .reduce((newArr, obj) => {
        for (let name of names) {
          if (obj.name === name) newArr.push(obj.id);
        }
        return newArr;
      }, [])
      .join(',');
  };

  getBboxXY = bbox => {
    return bbox.map(item => {
      const bboxItem = item[0];
      return { x: [bboxItem[0][0], bboxItem[1][0]], y: [bboxItem[0][1], bboxItem[2][1]] };
    });
  };

  filterSites = (sites, bbox) => {
    const bboxList = this.getBboxXY(bbox);

    return sites.reduce((newSites, site) => {
      const point = [site.longitude, site.latitude];

      for (const { x, y } of bboxList) {
        if (point[0] >= x[0] && point[0] <= x[1] && point[1] >= y[0] && point[1] <= y[1])
          newSites.push(site);
      }

      return newSites;
    }, []);
  };

  fetchSitesChunk = async (params, pageNo = 1) => {
    const { data } =
      (await summary.get('/summarysites/', {
        params: {
          page: pageNo,
          ...params
        }
      })) || {};

    return data;
  };

  fetchEntiresSites = async (params, pageNo = 1) => {
    const fetchResults = await this.fetchSitesChunk(params, pageNo);
    const { results, count } = fetchResults;

    if (pageNo * this.state.queryLimit < count)
      return [...results].concat(await this.fetchEntiresSites(params, pageNo + 1));

    return results;
  };

  fetchAllChoices = async params => {
    const { filterChoices } = this.state;
    const projectsParam = params.project_id && params.project_id.split(/,(?=\S)|:/);
    const organizationsParam = params.tag_id && params.tag_id.split(/,(?=\S)|:/);
    const projectApi = summary.get('/projects/?showall&status=90&limit=1000');
    const organizationApi = summary.get('/projecttags/');
    const choicesApi = summary.get('/choices/');

    return await Promise.all([projectApi, organizationApi, choicesApi]).then(response => {
      const {
        data: { results: projects }
      } = response[0];

      const {
        data: { results: organizations }
      } = response[1];

      const { data: countries } = response[2];
      const country_list = this.getChoices('countries', countries);

      filterChoices.projects = projects;
      filterChoices.countries = this.fetchNonTestProjectChoices(
        projects,
        'countries',
        country_list
      );
      filterChoices.tags = this.fetchNonTestProjectChoices(projects, 'tags', organizations);

      //when project names are set, convert to project ids for querying
      if (projectsParam) params.project_id = this.convertToId(projectsParam, projects);

      //when organization names are set, convert to tag ids for querying
      if (organizationsParam) params.tag_id = this.convertToId(organizationsParam, organizations);

      this.setState({ filterChoices, isFilteringChoices: false });
      return params;
    });
  };

  fetchAllSites = async params => {
    const { metrics } = this.state;
    const updatedParams = await this.fetchAllChoices(params);
    const sites = await this.fetchEntiresSites(updatedParams);

    if (sites.length === 0) {
      metrics.map(metric => (metric.count = 0));
      this.setState({ metrics, isFiltering: false });
    }

    this.setState({ sites, isFiltering: false });
  };

  resize() {
    let currentMobileDisplay = window.innerWidth < 960;

    if (currentMobileDisplay !== this.state.mobileDisplay)
      this.setState({
        mobileDisplay: currentMobileDisplay,
        sidePanelOpen: !currentMobileDisplay
      });
  }

  handleDrawerChange = () => this.setState({ sidePanelOpen: !this.state.sidePanelOpen });

  siteClickHandler = site => {
    const { highlightCluster, popupSiteList, sidePanelOpen, mobileDisplay } = this.state;
    const siteDropdownList = popupSiteList.map(({ site_id }) => site_id);
    const selectedSite = site.key ? this.siteLookup(site) : site;
    const siteExistsInCluster = siteDropdownList.find(site => site === selectedSite.site_id)
      ? true
      : false;

    if (highlightCluster !== null && !siteExistsInCluster) {
      highlightCluster.clearLayers();
      this.setState({ highlightCluster: null, popupOpen: true });
    } else if (highlightCluster !== null && siteExistsInCluster) this.setState({ popupOpen: true });
    else if (highlightCluster === null) this.setState({ popupOpen: false });

    if (!mobileDisplay && !sidePanelOpen) this.setState({ sidePanelOpen: true });

    this.setState({
      siteDetail: selectedSite,
      showSiteDetail: true,
      zoomFullMap: false,
      dragPanelPosition: { x: 0, y: -70 }
    });
  };

  siteDropDownHandler = selectedSites => {
    const { sidePanelOpen, mobileDisplay } = this.state;

    if (!(mobileDisplay || sidePanelOpen)) this.setState({ sidePanelOpen: true });

    this.setState({
      siteDetail: selectedSites[0],
      popupSiteList: selectedSites,
      popupOpen: true,
      showSiteDetail: true,
      zoomFullMap: false,
      dragPanelPosition: { x: 0, y: -70 }
    });
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

  setClusterActive = clusterMarker => this.setState({ highlightCluster: clusterMarker });

  getMapBounds = bbox => this.setState({ bbox });

  getCount(array, key) {
    let result = array.map(item => item[key]);

    if (key === 'project_admins') {
      const adminList = array.map(item => item[key].map(secItem => secItem.name));
      result = [].concat.apply([], adminList);
    }

    return new Set(result).size;
  }

  getUserCount(array, choices) {
    const projectFilter = array.map(({ project_id }) => project_id);
    const projectSet = [...new Set(projectFilter)];
    const memberExtract = choices.reduce((memberList, project) => {
      if (projectSet.find(id => id === project.id) && Array.isArray(project.members))
        memberList.push(...project.members);
      return memberList;
    }, []);

    return new Set(memberExtract).size;
  }

  getUniqueSiteCount(array) {
    const coordinatesArr = array.map(({ latitude, longitude }) => [latitude, longitude]);
    const duplicateList = coordinatesArr.reduce((duplicatesFound, coordinates) => {
      return {
        ...duplicatesFound,
        [coordinates]: (duplicatesFound[coordinates] || 0) + 1
      };
    }, {});

    return Object.keys(duplicateList).length;
  }

  getTransectCount(array) {
    const protocols = array.map(({ protocols }) => protocols);

    const protocolCount = protocols
      .map(({ beltfish, benthicpit, benthiclit, habitatcomplexity, colonies_bleached }) => {
        const beltfishCount = beltfish ? beltfish.sample_unit_count : 0;
        const benthicPitCount = benthicpit ? benthicpit.sample_unit_count : 0;
        const benthicLitCount = benthiclit ? benthiclit.sample_unit_count : 0;
        const habitatComplexityCount = habitatcomplexity ? habitatcomplexity.sample_unit_count : 0;
        const coloniesBleachedCount = colonies_bleached ? colonies_bleached.sample_unit_count : 0;

        return (
          beltfishCount +
          benthicPitCount +
          benthicLitCount +
          habitatComplexityCount +
          coloniesBleachedCount
        );
      })
      .reduce((acc, val) => acc + val, 0);

    return protocolCount;
  }

  getBenthicHardCoralCount = protocols => {
    return protocols.map(({ benthiclit, benthicpit }) => {
      let hardCoralValue;
      if (benthiclit || benthicpit) {
        const benthicpitPercentCover =
          benthicpit !== undefined && benthicpit.percent_cover_by_benthic_category_avg;
        const benthiclitPercentCover =
          benthiclit !== undefined && benthiclit.percent_cover_by_benthic_category_avg;
        const benthicPercentCover = benthicpit ? benthicpitPercentCover : benthiclitPercentCover;
        hardCoralValue = benthicPercentCover && benthicPercentCover['Hard coral'];

        if (benthicpit !== undefined && benthiclit !== undefined) {
          hardCoralValue =
            (benthicpitPercentCover['Hard coral'] + benthiclitPercentCover['Hard coral']) / 2;
        }
      }
      return hardCoralValue;
    });
  };

  getAvgCoralCount(protocols) {
    const benthicHardCoralCount = this.getBenthicHardCoralCount(protocols);
    const filteredBenthicHardCoralCount = benthicHardCoralCount.filter(val => val !== undefined);
    const sumOfCoralCover = filteredBenthicHardCoralCount.reduce((acc, val) => acc + val, 0);
    const avgCoralCover = sumOfCoralCover
      ? sumOfCoralCover / filteredBenthicHardCoralCount.length
      : sumOfCoralCover;

    return Math.round(avgCoralCover);
  }

  histogramCount(protocols, histogramData) {
    const benthicHardCoralCount = this.getBenthicHardCoralCount(protocols);

    return histogramData.map(({ x }) => {
      let count = 0;

      for (let i = 0; i < benthicHardCoralCount.length; i++) {
        const calDiff = parseFloat(x - benthicHardCoralCount[i]).toFixed(2);
        if (benthicHardCoralCount[i] && (0 <= calDiff && calDiff < 2)) {
          count += 1;
        }
      }

      return { x, y: count, label: count };
    });
  }

  contentLoadHandler = option => this.setState({ isLoading: option });

  siteLookup = ({ key: siteId }) => this.state.sites.filter(({ site_id }) => site_id === siteId)[0];

  filterHandler = ({ country, project, organization, date_min_after, date_max_before }) => {
    const filterParams = { ...this.state.filterParams };
    filterParams.country = country;
    filterParams.project = project;
    filterParams.organization = organization;
    filterParams.date_min_after = date_min_after;
    filterParams.date_max_before = date_max_before;

    this.setState({ filterParams });
  };

  filterUpdate = (queryStrings = []) => {
    const { filterParams } = this.state;
    const countryProperty = Object.entries(filterParams)[0];
    const projectIdProperty = Object.entries(filterParams)[1];
    const organizationIdProperty = Object.entries(filterParams)[2];
    const dateMinProperty = Object.entries(filterParams)[3];
    const dateMaxProperty = Object.entries(filterParams)[4];

    if (countryProperty[1].length > 0)
      queryStrings.push([countryProperty[0], countryProperty[1].join(',')].join('='));

    if (projectIdProperty[1].length > 0)
      queryStrings.push([projectIdProperty[0], projectIdProperty[1].join(',')].join('='));

    if (organizationIdProperty[1].length > 0)
      queryStrings.push([organizationIdProperty[0], organizationIdProperty[1].join(',')].join('='));

    if (dateMinProperty[1].length > 0 || dateMaxProperty[1].length > 0) {
      const dateString = [`${dateMinProperty[1]}`, `${dateMaxProperty[1]}`].join(',');
      queryStrings.push(['date', dateString].join('='));
    }

    this.props.history.push({
      pathname: '/',
      search: '?' + queryStrings.join('&')
    });

    window.location.reload();
  };

  getChoices = (choice_name, choices) => {
    return choices
      .reduce((newArray, obj) => {
        if (obj.name === choice_name) {
          newArray = obj.data;
        }
        return newArray;
      }, [])
      .map(({ site_id: id, name }) => {
        return { id, name };
      });
  };

  fetchNonTestProjectChoices = (projects, property, property_array) => {
    const result = projects
      .reduce((nonTestProject, project) => {
        if (project[property].length !== 0) {
          nonTestProject.push(project[property]);
        }
        return nonTestProject;
      }, [])
      .join(',')
      .split(',');

    return property_array.filter(({ name }) => [...new Set(result)].includes(name));
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
          isFiltering={this.state.isFiltering}
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
          showFilterNumbers={this.state.showFilterNumbers}
          numberOfFilteredSites={this.state.sites.length}
          isFilteringChoices={this.state.isFilteringChoices}
          highlightMarker={this.state.highlightMarker}
        />
        <LeafletMap
          sidePanelOpen={this.state.sidePanelOpen}
          markersData={this.state.sites}
          siteDetail={this.state.siteDetail}
          siteClickHandler={this.siteClickHandler}
          siteDropDownHandler={this.siteDropDownHandler}
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
          mobileDisplay={this.state.mobileDisplay}
        />
        {this.state.mobileDisplay && (
          <BottomSummaryPanel
            metrics={this.state.metrics}
            isLoading={this.state.isLoading}
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
